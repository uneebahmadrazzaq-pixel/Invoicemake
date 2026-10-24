import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
const source=await readFile(new URL('../cloud/client.ts',import.meta.url),'utf8');
const fragment=source.slice(source.indexOf('async function uploadStorageValue('),source.indexOf('async function performStorageUpload('));
const compiled=(await transform(fragment,{loader:'ts'})).code;
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('an older autosave cannot overtake a later explicit save',async()=>{
  const calls=[],finish=[];
  const context=vm.createContext({storageUploadQueues:new Map(),authUser:{id:'user'},performStorageUpload:async(_key,value)=>{calls.push(value);await new Promise(resolve=>finish.push(resolve));}});
  vm.runInContext(compiled,context);
  const old=context.uploadStorageValue('key','old');
  const latest=context.uploadStorageValue('key','saved');
  await tick();assert.deepEqual(calls,['old']);
  finish[0]();await old;await tick();assert.deepEqual(calls,['old','saved']);
  finish[1]();await latest;
  assert.equal(context.storageUploadQueues.size,0);
});
test('queued workspace writes cannot cross an account change',async()=>{
  const context=vm.createContext({storageUploadQueues:new Map(),authUser:{id:'one'},performStorageUpload:async()=>assert.fail('No write expected')});
  vm.runInContext(compiled,context);
  const pending=context.uploadStorageValue('key','private data');
  context.authUser={id:'two'};
  await assert.rejects(pending,/account changed/);
});
