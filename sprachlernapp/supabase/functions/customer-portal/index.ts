import Stripe from "npm:stripe@^18";
import { createClient } from "npm:@supabase/supabase-js@2";
const stripe=new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
Deno.serve(async(req)=>{
 try{
  const auth=req.headers.get("Authorization");if(!auth)return new Response("Unauthorized",{status:401});
  const scoped=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,{global:{headers:{Authorization:auth}}});
  const {data:{user}}=await scoped.auth.getUser();if(!user)return new Response("Unauthorized",{status:401});
  const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SECRET_KEY")!);
  const {data}=await admin.from("subscriptions").select("stripe_customer_id").eq("user_id",user.id).single();
  if(!data?.stripe_customer_id)throw new Error("No Stripe customer");
  const session=await stripe.billingPortal.sessions.create({customer:data.stripe_customer_id,return_url:`${Deno.env.get("SITE_URL")}/sprachlernapp/pricing.html`});
  return Response.json({url:session.url});
 }catch(e){return Response.json({error:String(e.message||e)},{status:400})}
});
