import Stripe from "npm:stripe@^18";
import { createClient } from "npm:@supabase/supabase-js@2";
const stripe=new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
Deno.serve(async(req)=>{
 try{
  const auth=req.headers.get("Authorization");if(!auth)return new Response("Unauthorized",{status:401});
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,{global:{headers:{Authorization:auth}}});
  const {data:{user}}=await supabase.auth.getUser();if(!user)return new Response("Unauthorized",{status:401});
  const {billing="monthly"}=await req.json();
  const price=billing==="annual"?Deno.env.get("STRIPE_PRICE_PRO_ANNUAL"):Deno.env.get("STRIPE_PRICE_PRO_MONTHLY");
  if(!price)throw new Error("Stripe Price ID missing");
  const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SECRET_KEY")!);
  const {data:sub}=await admin.from("subscriptions").select("stripe_customer_id").eq("user_id",user.id).maybeSingle();
  let customer=sub?.stripe_customer_id;
  if(!customer){
   const c=await stripe.customers.create({email:user.email,metadata:{supabase_user_id:user.id}});customer=c.id;
   await admin.from("subscriptions").upsert({user_id:user.id,plan:"free",status:"inactive",stripe_customer_id:customer});
  }
  const site=Deno.env.get("SITE_URL")!;
  const session=await stripe.checkout.sessions.create({
   customer,mode:"subscription",line_items:[{price,quantity:1}],
   subscription_data:{trial_period_days:Number(Deno.env.get("STRIPE_TRIAL_DAYS")||"7"),metadata:{supabase_user_id:user.id}},
   success_url:`${site}/sprachlernapp/index.html?checkout=success`,
   cancel_url:`${site}/sprachlernapp/pricing.html?checkout=cancelled`,
   allow_promotion_codes:true
  });
  return Response.json({url:session.url});
 }catch(e){return Response.json({error:String(e.message||e)},{status:400})}
});
