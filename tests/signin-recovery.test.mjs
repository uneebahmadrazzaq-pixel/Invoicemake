import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../cloud/client.ts", import.meta.url), "utf8");
function evaluate(code, context) {
  vm.runInContext(ts.transpileModule(code, {compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText, context);
}

test("stalled sign-in unlocks the form and resets captcha, duplicate submits are ignored", async () => {
  let submit, timeout, calls = 0, resets = 0, error = "", busy = false;
  const form = {dataset:{}, reportValidity:()=>true, addEventListener:(_name,handler)=>submit=handler};
  const context = vm.createContext({
    window:{setTimeout:callback=>(timeout=callback,1),clearTimeout:()=>{}},
    document:{getElementById:id=>id === "invoiceSignInForm" ? form : null},
    supabase:{auth:{signInWithPassword:()=>{calls++;return new Promise(()=>{});}}},
    FormData:class {get(){return "test";}},
    captchaTokenFor:()=>"verified-token",setAuthBusy:(_form,value)=>busy=value,
    resetCaptcha:()=>resets++,showAuthError:value=>error=value.message,
    renderPasswordResetRequest:()=>{},getWorkspaceRedirectUrl:()=>"/editor/",location:{assign:()=>assert.fail("must not redirect on timeout")},
  });
  evaluate(source.slice(source.indexOf("async function withAuthTimeout"), source.indexOf("function loadHcaptcha")),context);
  evaluate(source.slice(source.indexOf("function bindSignInForm"), source.indexOf("function renderPasswordResetRequest")),context);
  context.bindSignInForm();
  const pending = submit({preventDefault(){}});
  await submit({preventDefault(){}});
  assert.equal(calls,1);
  assert.equal(busy,true);
  timeout();
  await pending;
  assert.equal(busy,false);
  assert.equal(resets,1);
  assert.match(error,/taking too long/);
  assert.equal(form.dataset.signInPending,undefined);
});

test("captcha loader failure removes the failed script and allows a fresh retry", async () => {
  let timeout, removed = 0, scripts = 0;
  const context = vm.createContext({hcaptchaLoader:null,window:{setTimeout:callback=>(timeout=callback,1),clearTimeout:()=>{}},document:{getElementById:()=>null,createElement:()=>({addEventListener(){},removeEventListener(){},remove(){removed++;}}),head:{appendChild(){scripts++;}}}});
  evaluate(source.slice(source.indexOf("function loadHcaptcha"),source.indexOf("async function mountCaptcha")),context);
  const first=context.loadHcaptcha();
  timeout();
  await assert.rejects(first,/too long/);
  assert.equal(removed,1);
  assert.equal(context.hcaptchaLoader,null);
  const second=context.loadHcaptcha();
  assert.equal(scripts,2);
  timeout();
  await assert.rejects(second,/too long/);
});

test("network timeout aborts stalled requests and cleans up", async () => {
  let timeout, signal, cleared=false;
  const context=vm.createContext({AbortController,Request,window:{setTimeout:callback=>(timeout=callback,1),clearTimeout:()=>cleared=true},fetch:(_input,options)=>{signal=options.signal;return new Promise((_,reject)=>signal.addEventListener("abort",()=>reject(new Error("aborted"))));}});
  evaluate(source.slice(source.indexOf("async function fetchWithTimeout"),source.indexOf("async function withAuthTimeout")),context);
  const pending=context.fetchWithTimeout("https://example.test/auth");
  timeout();
  await assert.rejects(pending,/aborted/);
  assert.equal(signal.aborted,true);
  assert.equal(cleared,true);
});
