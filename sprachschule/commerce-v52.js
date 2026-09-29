document.addEventListener("DOMContentLoaded",()=>{
  const select=document.getElementById("sw52-package");
  const map={"Economy":"Economy – 49 € / 60 Min.","Standard":"Standard – 179 € / Monat","Premium":"Premium – 329 € / Monat","Pro":"Pro – 599 € / Monat","Einstufung + Lernplan":"Einstufung + Lernplan – 29 €","Writing Review":"Writing Review – 39 €","Conversation Booster":"Conversation Booster – 89 €","Geschenkgutschein":"Geschenkgutschein – ab 49 €","Firmenpaket 10x60":"Firmenpaket 10×60 – ab 1.290 €"};
  document.querySelectorAll(".sw52-buy[data-plan]").forEach(a=>a.addEventListener("click",()=>{
    const plan=a.dataset.plan||""; if(select && map[plan]) select.value=map[plan];
    document.querySelectorAll(".sw52-card").forEach(c=>c.classList.toggle("is-selected",c.dataset.plan===plan));
    try{sessionStorage.setItem("sprachwerk_selected_plan",plan)}catch(e){}
  }));
  try{const plan=sessionStorage.getItem("sprachwerk_selected_plan"); if(plan&&select&&map[plan]) select.value=map[plan]}catch(e){}
});
