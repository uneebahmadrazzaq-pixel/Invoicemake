import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
const source=await readFile(new URL('../supabase/functions/admin-delete-user/index.ts',import.meta.url),'utf8');
const edgeCode=source.replace(/^import .*;\r?\n/gm,'');
function setup({authorized=true,adminTarget=false,authenticated=true}={}) {
  let handler;const operations=[];
  const caller={auth:{getUser:async()=>({data:{user:authenticated?{id:'admin'}:null},error:!authenticated})},rpc:async(name,args)=>{operations.push('preflight');return authorized?{data:{id:'user',email:'user@example.test'}}:{error:{message:'Administrator access required'}};}};
  let listed=false;
  const admin={from:table=>table==='profiles'?{select:()=>({eq:()=>({single:async()=>({data:{id:'user',email:'user@example.test',role:adminTarget?'admin':'user'}})})})}:{insert:async row=>{operations.push(row.action);return {}; }},storage:{from:()=>({list:async()=>{if(listed)return {data:[]};listed=true;return {data:[{id:'avatar',name:'avatar.png'}]};},remove:async paths=>{operations.push(['remove',...paths]);return {};}})},auth:{admin:{deleteUser:async id=>{operations.push(['delete',id]);return {};}}}};
  vm.runInNewContext(edgeCode,{Request,Response,Set,Error,JSON,Deno:{env:{get:name=>name},serve:value=>handler=value},createClient:(_url,key)=>key==='SUPABASE_SERVICE_ROLE_KEY'?admin:caller});
  return {operations,run:()=>handler(new Request('https://example.test',{method:'POST',headers:{origin:'https://www.invoicemakertool.online',authorization:'Bearer test','content-type':'application/json'},body:JSON.stringify({userId:'user',confirmationEmail:'user@example.test'})}))};
}
test('unverified and non-admin requests never reach account deletion',async()=>{
  for(const options of [{authenticated:false},{authorized:false},{adminTarget:true}]) {
    const {run,operations}=setup(options);const response=await run();
    assert.ok(response.status>=400);
    assert.ok(!operations.some(value=>Array.isArray(value)&&value[0]==='delete'));
  }
});
test('confirmed account deletion audits first, removes only the user avatar path, then uses the Auth admin API',async()=>{
  const {run,operations}=setup();const response=await run();
  assert.equal(response.status,200);assert.equal((await response.json()).deleted,true);
  assert.deepEqual(JSON.parse(JSON.stringify(operations)),['preflight','user_deletion_requested',['remove','user/avatar.png'],['delete','user'],'user_deleted']);
});
test('admin customer reports escape names and distinguish download starts from unique invoices',async()=>{
  const cloud=await readFile(new URL('../cloud/client.ts',import.meta.url),'utf8');
  const snippet=cloud.slice(cloud.indexOf('function adminUserActivityMarkup('),cloud.indexOf('function normalizedFeatures('));
  const compiled=await transform(snippet,{loader:'ts'});
  const context=vm.createContext({adminActivityError:'',adminActivity:new Map([['user',{customer_count:1,download_count:3,customers:[{customer_name:'<script>bad</script>',active:true,distinct_invoices:2,downloads:3,last_download_at:null}]}]]),escapeHtml:value=>String(value).replaceAll('<','&lt;').replaceAll('>','&gt;')});
  vm.runInContext(compiled.code,context);
  const html=context.adminUserActivityMarkup('user');
  assert.ok(html.includes('Customers added: 1'));
  assert.ok(html.includes('Invoice downloads started: 3'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>bad'));
  assert.ok(html.includes('older downloads cannot be recovered'));
});
