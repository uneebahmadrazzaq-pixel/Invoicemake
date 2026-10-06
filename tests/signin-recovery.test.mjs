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

test("network timeout stays active while a response body is stalled", async () => {
  let timeout, signal, cleared = false;
  const context = vm.createContext({AbortController,Request,
    window:{setTimeout:callback=>(timeout=callback,1),clearTimeout:()=>cleared=true},
    fetch:async (_input,options)=>{
      signal=options.signal;
      return {clone:()=>({arrayBuffer:()=>new Promise((_,reject)=>{
        if (signal.aborted) reject(new Error("body aborted"));
        else signal.addEventListener("abort",()=>reject(new Error("body aborted")));
      })})};
    },
  });
  evaluate(source.slice(source.indexOf("async function fetchWithTimeout"),source.indexOf("async function withAuthTimeout")),context);
  const pending=context.fetchWithTimeout("https://example.test/auth");
  await Promise.resolve();
  assert.equal(cleared,false);
  timeout();
  await assert.rejects(pending,/body aborted/);
  assert.equal(cleared,true);
});

test("successful sign-in changes to workspace progress and redirects only with a session", async () => {
  let submit, redirect, label;
  const form={dataset:{},reportValidity:()=>true,addEventListener:(_name,handler)=>submit=handler};
  const context=vm.createContext({
    document:{getElementById:id=>id==="invoiceSignInForm"?form:null},
    supabase:{auth:{signInWithPassword:async ()=>({data:{session:{access_token:"test"}},error:null})}},
    withAuthTimeout:operation=>operation, FormData:class {get(){return "test";}},
    captchaTokenFor:()=>"verified",setAuthBusy:(_form,_busy,value)=>label=value,
    resetCaptcha:()=>assert.fail("must not reset successful captcha"),showAuthError:()=>assert.fail("must not error"),
    renderPasswordResetRequest:()=>{},getWorkspaceRedirectUrl:()=>"/editor/?auth=workspace#tool",
    location:{assign:url=>redirect=url},
  });
  evaluate(source.slice(source.indexOf("function bindSignInForm"),source.indexOf("function renderPasswordResetRequest")),context);
  context.bindSignInForm();
  await submit({preventDefault(){}});
  assert.equal(label,"Opening workspace…");
  assert.equal(redirect,"/editor/?auth=workspace#tool");
});

test("existing unchanged profiles avoid redundant writes and repeated profile fetches", () => {
  assert.match(source,/const profileNeedsRefresh = !existingUser/);
  assert.match(source,/profileNeedsRefresh \? await retryCloudResult/);
  assert.match(source,/profileNeedsRefresh && !ensureError \? await loadCurrentUser\(sessionUser.id\) : existingUser/);
  const accessIndex=source.indexOf("enforceLoginAccess(authenticatedSession)");
  assert.ok(accessIndex>0 && accessIndex<source.indexOf("openAuthorizedWorkspace();"));
  assert.match(source,/await Promise.all\(\[\s+enforceLoginAccess\(authenticatedSession\),\s+loadCurrentUser\(sessionUser.id\)/);
});
