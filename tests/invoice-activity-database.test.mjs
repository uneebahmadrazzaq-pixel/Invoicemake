import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const migration=await readFile(new URL('../supabase/migrations/202610240001_invoice_download_activity.sql',import.meta.url),'utf8');
const A='00000000-0000-4000-8000-000000000001',B='00000000-0000-4000-8000-000000000002',ADMIN='00000000-0000-4000-8000-000000000003',ADMIN2='00000000-0000-4000-8000-000000000004';
const request='10000000-0000-4000-8000-000000000001';
test('Postgres enforces saved snapshots, tenant ownership, idempotent accounting and admin-only reports/deletion checks',async t=>{
  const db=new PGlite();
  const role=async(id,authenticated=true)=>{await db.exec(`reset role; set app.user_id='${id}';${authenticated?'set role authenticated;':''}`);};
  const invoice={id:'invoice-1',clientId:'client-1',templateId:'costcousa',invoiceNumber:'100',items:[{qty:2,unit:10}]};
  const client={id:'client-1',name:'Customer One'};
  const payload=async(value)=>{await role(A,false);await db.query(`update public.user_data set payload=$1 where user_id=$2`,[value,A]);};
  const record=async(invoices,id=request)=>db.query('select public.record_invoice_download($1,$2,$3)',[id,invoices,'pdf']);
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth; create schema private;
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('app.user_id',true),'')::uuid$$;
      create table public.profiles(id uuid primary key,email text,name text,role text,status text,allowed_templates text[] default array['costcousa']);
      create table public.user_data(user_id uuid references public.profiles(id) on delete cascade,storage_key text,payload jsonb);
      create function private.is_active_user() returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.profiles where id=auth.uid() and status='active')$$;
      create function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.profiles where id=auth.uid() and status='active' and role='admin')$$;
      create function private.can_use_template(value text) returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.profiles where id=auth.uid() and value=any(allowed_templates))$$;
      grant usage on schema auth,private to authenticated;
      grant execute on all functions in schema auth,private to authenticated;
      insert into public.profiles(id,email,name,role,status) values('${A}','a@example.test','User A','user','active'),('${B}','b@example.test','User B','user','active'),('${ADMIN}','admin@example.test','Admin','admin','active'),('${ADMIN2}','admin2@example.test','Admin 2','admin','active');`);
    await db.query('insert into public.user_data values($1,$2,$3)',[A,'mc011-invoice-editor-v1',{clients:[client],invoices:[]}]);
    await db.exec(migration);
    await t.test('existing customers are backfilled and removal does not erase added-customer history',async()=>{
      assert.equal((await db.query('select count(*)::int n from public.customer_activity')).rows[0].n,1);
      await payload({clients:[client,{id:'client-2',name:'Removed Customer'}],invoices:[]});
      await payload({clients:[client],invoices:[]});
      const rows=(await db.query('select customer_id,active from public.customer_activity order by customer_id')).rows;
      assert.deepEqual(rows,[{customer_id:'client-1',active:true},{customer_id:'client-2',active:false}]);
    });
    await t.test('unsaved invoices and cross-user attempts fail',async()=>{
      await role(A);await assert.rejects(record([invoice]),/Save this invoice/);
      await payload({clients:[client],invoices:[invoice]});
      await role(B);await assert.rejects(record([invoice]),/Save this invoice/);
    });
    await t.test('a saved download is counted once per invoice/request, with no forged direct inserts',async()=>{
      await role(A);await record([invoice]);await record([invoice]);
      await assert.rejects(db.exec(`insert into public.invoice_download_events(user_id,customer_id,customer_name,invoice_id,invoice_number,template_id,format,request_id) values('${A}','x','x','x','x','x','pdf','${request}')`),/permission denied/);
      assert.deepEqual((await db.query('select * from public.invoice_download_events')).rows,[]);
      await role(ADMIN);assert.equal((await db.query('select count(*)::int n from public.invoice_download_events')).rows[0].n,1);
    });
    await t.test('edited invoices, revoked template access and partial-invalid batches are rejected atomically',async()=>{
      await role(A);
      await assert.rejects(record([{...invoice,items:[{qty:3,unit:10}]}]),/changed/);
      await assert.rejects(record([invoice,{...invoice,id:'unsaved'}],'10000000-0000-4000-8000-000000000002'),/Save this invoice/);
      await role(A,false);await db.query('update public.profiles set allowed_templates=$1 where id=$2',[[],A]);
      await role(A);await assert.rejects(record([invoice]),/Template access denied/);
      await role(A,false);await db.query('update public.profiles set allowed_templates=$1 where id=$2',[['costcousa'],A]);
      assert.equal((await db.query('select count(*)::int n from public.invoice_download_events')).rows[0].n,1);
    });
    await t.test('suspended users cannot export and a valid bulk file counts each invoice once',async()=>{
      await role(A,false);await db.query('update public.profiles set status=$1 where id=$2',['suspended',A]);
      await role(A);await assert.rejects(record([invoice]),/Active account/);
      await role(A,false);await db.query('update public.profiles set status=$1 where id=$2',['active',A]);
      const second={...invoice,id:'invoice-2',invoiceNumber:'101'};
      await payload({clients:[client],invoices:[invoice,second]});
      await role(A);
      const args=['10000000-0000-4000-8000-000000000003',[invoice,second],'bulk_pdf'];
      await db.query('select public.record_invoice_download($1,$2,$3)',args);
      await db.query('select public.record_invoice_download($1,$2,$3)',args);
    });
    await t.test('only admins can see the per-user/customer report',async()=>{
      await role(A);await assert.rejects(db.query('select public.admin_user_activity()'),/Administrator access/);
      await role(ADMIN);
      const report=(await db.query('select public.admin_user_activity() report')).rows[0].report;
      const user=report.find(row=>row.user_id===A);
      assert.equal(Number(user.customer_count),2);assert.equal(Number(user.download_count),3);
      assert.equal(Number(user.customers.find(row=>row.customer_id==='client-1').downloads),3);
      assert.equal(Number(user.customers.find(row=>row.customer_id==='client-1').distinct_invoices),2);
      assert.equal(Number(user.customers.find(row=>row.customer_id==='client-2').downloads),0);
    });
    await t.test('deletion requires an active admin, exact email and a non-admin target other than self',async()=>{
      await role(A);await assert.rejects(db.query('select public.admin_delete_user_preflight($1,$2)',[B,'b@example.test']),/Administrator access/);
      await role(ADMIN);
      await assert.rejects(db.query('select public.admin_delete_user_preflight($1,$2)',[ADMIN,'admin@example.test']),/own account/);
      await assert.rejects(db.query('select public.admin_delete_user_preflight($1,$2)',[ADMIN2,'admin2@example.test']),/protected/);
      await assert.rejects(db.query('select public.admin_delete_user_preflight($1,$2)',[B,'wrong@example.test']),/does not match/);
      const result=(await db.query('select public.admin_delete_user_preflight($1,$2) result',[B,'b@example.test'])).rows[0].result;
      assert.equal(result.id,B);
    });
  } finally {await db.close();}
});
