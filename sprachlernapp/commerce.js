let sb=null,billing="monthly";
function msg(t){alert(t)}
async function initCommerce(){
 const cfg=window.SUPABASE_CONFIG||{};
 if(!cfg.url||cfg.url.includes("YOUR-PROJECT"))return;
 sb=supabase.createClient(cfg.url,cfg.publishableKey);
}
document.querySelectorAll("[data-billing]").forEach(b=>b.onclick=()=>{
 billing=b.dataset.billing;document.querySelectorAll("[data-billing]").forEach(x=>x.classList.toggle("active",x===b));
 document.getElementById("pro-price").innerHTML=billing==="annual"?"79 € <small>/ Jahr</small>":"9,90 € <small>/ Monat</small>";
});
document.getElementById("start-pro")?.addEventListener("click",async()=>{
 if(!sb)return msg("Supabase muss zuerst konfiguriert werden.");
 const {data:{session}}=await sb.auth.getSession();if(!session)return msg("Bitte zuerst in der Sprachlernapp einloggen.");
 const {data,error}=await sb.functions.invoke("create-checkout",{body:{billing}});
 if(error||!data?.url)return msg("Checkout konnte nicht gestartet werden.");
 location.href=data.url;
});
document.getElementById("open-portal")?.addEventListener("click",async()=>{
 if(!sb)return msg("Supabase muss zuerst konfiguriert werden.");
 const {data:{session}}=await sb.auth.getSession();if(!session)return msg("Bitte zuerst einloggen.");
 const {data,error}=await sb.functions.invoke("customer-portal");
 if(error||!data?.url)return msg("Kundenportal konnte nicht geöffnet werden.");
 location.href=data.url;
});
initCommerce();
