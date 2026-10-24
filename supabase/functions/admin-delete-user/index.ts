// @ts-nocheck -- Checked in the Supabase Deno deployment environment.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.116.0";

const origins = new Set(["https://www.invoicemakertool.online", "https://invoicemakertool.online", "http://www.invoicemakertool.online", "http://invoicemakertool.online", "https://uneebahmadrazzaq-pixel.github.io", "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:4173", "http://127.0.0.1:4173"]);
Deno.serve(async req => {
  const origin=req.headers.get("origin");
  const headers={"Access-Control-Allow-Origin":origin && origins.has(origin)?origin:"https://www.invoicemakertool.online","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json","Vary":"Origin"};
  const respond=(status,body)=>new Response(JSON.stringify(body),{status,headers});
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers});
  if(req.method!=="POST" || (origin && !origins.has(origin))) return respond(403,{error:"Request not allowed."});
  try {
    const authorization=req.headers.get("authorization") || "";
    const token=authorization.replace(/^Bearer\s+/i, "");
    if (!token || token === authorization) return respond(401,{error:"A signed-in session is required."});
    const caller=createClient(Deno.env.get("SUPABASE_URL"),Deno.env.get("SUPABASE_ANON_KEY"),{global:{headers:{Authorization:authorization}},auth:{persistSession:false,autoRefreshToken:false}});
    const {data:identity,error:identityError}=await caller.auth.getUser(token);
    if(identityError || !identity.user) return respond(401,{error:"Sign in again before deleting a user."});
    const body=await req.json();
    const {data:target,error:permissionError}=await caller.rpc("admin_delete_user_preflight",{p_user_id:body.userId,p_confirmation_email:body.confirmationEmail});
    if(permissionError || !target) return respond(403,{error:permissionError?.message || "Deletion not authorized."});
    const admin=createClient(Deno.env.get("SUPABASE_URL"),Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false,autoRefreshToken:false}});
    // Recheck immediately before mutation. No service-role key is returned to the browser.
    const {data:profile,error:profileError}=await admin.from("profiles").select("id,email,role").eq("id",target.id).single();
    if(profileError || profile.role==="admin" || profile.id===identity.user.id || profile.email!==target.email) return respond(409,{error:"The account changed. Refresh the directory and try again."});
    const {error:auditError}=await admin.from("audit_logs").insert({actor_user_id:identity.user.id,target_user_id:target.id,action:"user_deletion_requested",details:{userId:target.id,email:target.email}});
    if(auditError) throw new Error("Deletion audit could not be recorded; no account was deleted.");
    // Avatars are the only user-uploaded Storage files in this application.
    // Use the Storage API, not SQL deletion of storage.objects metadata.
    while(true) {
      const {data:files,error:listError}=await admin.storage.from("avatars").list(target.id,{limit:100});
      if(listError) throw listError;
      if(!files?.length) break;
      if(files.some(file=>!file.id)) throw new Error("Nested avatar files require manual cleanup before deletion.");
      const {error:removeError}=await admin.storage.from("avatars").remove(files.map(file=>`${target.id}/${file.name}`));
      if(removeError) throw removeError;
    }
    // Auth deletion cascades the profile, saved workspace and activity records.
    const {error:deleteError}=await admin.auth.admin.deleteUser(target.id);
    if(deleteError) throw deleteError;
    await admin.from("audit_logs").insert({actor_user_id:identity.user.id,action:"user_deleted",details:{userId:target.id,email:target.email}});
    return respond(200,{deleted:true});
  } catch(error) {
    return respond(400,{error:error instanceof Error?error.message:"User could not be deleted."});
  }
});
