import Stripe from "npm:stripe@^18";
import { createClient } from "npm:@supabase/supabase-js@2";
const stripe=new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const cryptoProvider=Stripe.createSubtleCryptoProvider();
Deno.serve(async(req)=>{
 const sig=req.headers.get("Stripe-Signature")||"";const body=await req.text();
 let event:Stripe.Event;
 try{event=await stripe.webhooks.constructEventAsync(body,sig,Deno.env.get("STRIPE_WEBHOOK_SECRET")!,undefined,cryptoProvider)}
 catch(e){return new Response("Bad signature",{status:400})}
 const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SECRET_KEY")!);
 const sync=async(sub:Stripe.Subscription)=>{
  const uid=String(sub.metadata?.supabase_user_id||"");if(!uid)return;
  const active=["active","trialing"].includes(sub.status);
  await admin.from("subscriptions").upsert({
   user_id:uid,plan:active?"pro":"free",status:sub.status,
   stripe_customer_id:String(sub.customer),stripe_subscription_id:sub.id,
   current_period_end:new Date(sub.current_period_end*1000).toISOString(),updated_at:new Date().toISOString()
  });
 };
 if(event.type==="customer.subscription.created"||event.type==="customer.subscription.updated"||event.type==="customer.subscription.deleted")await sync(event.data.object as Stripe.Subscription);
 return Response.json({received:true});
});
