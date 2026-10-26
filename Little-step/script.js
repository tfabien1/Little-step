/* ====== EDIT THIS PART ====== */
const CONFIG={
  whatsapp:"250780000000",        // your number, country code first, no + or spaces
  email:"hello@example.com",
  momoCode:"*182*1*1*07XXXXXXXX#", // your MoMo code or number
  momoName:"STEP UP HUB / Little Steps",
  rate:1450,                       // 1 USD in RWF
  yearPrice:7250, termPrice:2400,  // RWF per child
  sponsored:30, goal:200,           // children now / target
  formEndpoint:"",                 // optional: your free Formspree link, e.g. https://formspree.io/f/xxxx
  videos:{story:"",feeding:"",bible:"",visits:"",g1:"",g2:""}, // paste YouTube embed links, e.g. https://www.youtube.com/embed/XXXX
};
const CHILDREN=[ // SAMPLES: replace with real children (with guardian consent)
  {name:"Child A (sample)",school:"Gahondogo Primary",grade:"Primary 3",photo:"images/child1.jpg",story:"Loves counting and dreams of being a teacher. Often walks to school without breakfast."},
  {name:"Child B (sample)",school:"Bukane Primary",grade:"Primary 5",photo:"images/child2.jpg",story:"Enjoys football and singing. His family farms a small plot and meals are not always certain."},
  {name:"Child C (sample)",school:"Gahondogo Primary",grade:"Primary 2",photo:"images/child3.jpg",story:"Quiet and curious, she loves drawing. A school meal helps her stay focused in class."}
];
const GALLERY=[ // add or edit photos: {src, cat, cap}
  {src:"images/gallery/meal1.jpg",cat:"Meals",cap:"Lunch time at Gahondogo: every child gets a hot meal."},
  {src:"images/gallery/meal2.jpg",cat:"Meals",cap:"Serving porridge before the afternoon lessons."},
  {src:"images/gallery/meal3.jpg",cat:"Meals",cap:"Children wash their hands before eating."},
  {src:"images/gallery/bible1.jpg",cat:"Bible study",cap:"Singing together at our weekly Bible study."},
  {src:"images/gallery/bible2.jpg",cat:"Bible study",cap:"Learning a memory verse in small groups."},
  {src:"images/gallery/bible3.jpg",cat:"Bible study",cap:"A STEP UP HUB member tells a Bible story."},
  {src:"images/gallery/school1.jpg",cat:"Schools",cap:"Gahondogo Primary School."},
  {src:"images/gallery/school2.jpg",cat:"Schools",cap:"Bukane Primary School."},
  {src:"images/gallery/school3.jpg",cat:"Schools",cap:"Children ready for class."}
];
/* ====== END ====== */
const $=id=>document.getElementById(id),fmt=n=>Math.round(n).toLocaleString("en-US");
let plan="year",mode="kids";
// progress
$("fedNow").textContent=CONFIG.sponsored;$("spons").textContent=CONFIG.sponsored;$("goal").textContent=CONFIG.goal;
setTimeout(()=>$("fill").style.width=Math.min(100,CONFIG.sponsored/CONFIG.goal*100)+"%",400);
// calculator
function calc(){
  const n=+$("n").value;$("nv").textContent=n;
  let rwf=mode==="kids"?n*(plan==="year"?CONFIG.yearPrice:CONFIG.termPrice):(+$("custom").value||0);
  $("rwf").textContent=fmt(rwf)+" RWF";
  $("usd").textContent="about "+(rwf/CONFIG.rate).toFixed(rwf/CONFIG.rate<10?1:0)+" USD";
  $("feeds").textContent=mode==="kids"?"This feeds "+n+(n>1?" children":" child")+" for "+(plan==="year"?"the full year.":"one term."):"Every franc goes to school feeding.";
  return rwf;
}
$("n").oninput=calc;$("custom").oninput=calc;
$("plan").onclick=e=>{if(!e.target.dataset.p)return;plan=e.target.dataset.p;[...$("plan").children].forEach(b=>b.classList.toggle("on",b===e.target));calc()};
$("mode").onclick=e=>{if(!e.target.dataset.m)return;mode=e.target.dataset.m;[...$("mode").children].forEach(b=>b.classList.toggle("on",b===e.target));$("custom").style.display=mode==="custom"?"block":"none";calc()};
function wa(msg){window.open("https://wa.me/"+CONFIG.whatsapp+"?text="+encodeURIComponent(msg),"_blank")}
$("give").onclick=()=>{const r=calc();if(!r){alert("Please enter an amount.");return}
  wa("Hello Little Steps! I'd like to give "+fmt(r)+" RWF. "+$("feeds").textContent+($("who").value?" My name is "+$("who").value+".":""))};
// children
$("kids").innerHTML=CHILDREN.map((c,i)=>`<article class="card child"><img class="ph" src="${c.photo}" data-ph="Photo of ${c.name}" alt="${c.name}" loading="lazy"><h3>${c.name}</h3><span class="tag">${c.school} · ${c.grade}</span><p>${c.story}</p><button class="btn" data-i="${i}">Feed ${c.name.split(" (")[0]}</button></article>`).join("");
$("kids").onclick=e=>{const b=e.target.closest("button");if(!b)return;const c=CHILDREN[b.dataset.i];
  wa("Hello Little Steps! I'd like to sponsor "+c.name.replace(" (sample)","")+" ("+c.school+") for the full year ("+fmt(CONFIG.yearPrice)+" RWF).")};
// contact, pay, video
$("momoCode").textContent=CONFIG.momoCode;$("momoName").textContent=CONFIG.momoName;
["mailLink","mailLink2"].forEach(id=>{$(id).href="mailto:"+CONFIG.email;if(id==="mailLink2")$(id).textContent=CONFIG.email});
$("waLink").href="https://wa.me/"+CONFIG.whatsapp;$("waLink").textContent="+"+CONFIG.whatsapp;
$("yr").textContent=new Date().getFullYear();
document.querySelectorAll("[data-v]").forEach(v=>{const u=CONFIG.videos[v.dataset.v];if(u)v.innerHTML='<iframe src="'+u+'" title="Little Steps video" allowfullscreen loading="lazy"></iframe>'});
// gallery
const cats=["All",...new Set(GALLERY.map(g=>g.cat))];
function showGal(c){$("gal").innerHTML=GALLERY.filter(g=>c==="All"||g.cat===c).map(g=>`<figure><img src="${g.src}" data-ph="${g.cat} photo" alt="${g.cap}" loading="lazy"><figcaption>${g.cap}</figcaption></figure>`).join("");fixImgs($("gal"));
  [...$("filters").children].forEach(b=>b.classList.toggle("on",b.textContent===c))}
$("filters").innerHTML=cats.map(c=>`<button>${c}</button>`).join("");
$("filters").onclick=e=>{if(e.target.tagName==="BUTTON")showGal(e.target.textContent)};
$("gal").onclick=e=>{if(e.target.tagName!=="IMG")return;$("lb").querySelector("img").src=e.target.src;$("lb").querySelector("p").textContent=e.target.alt;$("lb").classList.add("on")};
$("lb").onclick=()=>$("lb").classList.remove("on");
// join form
let st=0;const fs=[...document.querySelectorAll(".fstep")],dots=[...document.querySelectorAll(".dots i")];
function go(n){st=n;fs.forEach((f,i)=>f.classList.toggle("on",i===n));dots.forEach((d,i)=>d.classList.toggle("on",i<=Math.min(n,2)));$("back").style.display=n>0&&n<3?"":"none";$("next").style.display=n===3?"none":"";$("next").textContent=n===2?"Create my account":"Next";$("err").textContent=""}
const role=()=>(document.querySelector("input[name=role]:checked")||{}).value;
$("next").onclick=async()=>{
  const e=m=>{$("err").textContent=m;return 1};
  if(st===0){if(!$("fn").value.trim())return e("Please enter your full name.");if(!/^\S+@\S+\.\S+$/.test($("fe").value))return e("Please enter a valid email.");if($("fp").value.trim().length<7)return e("Please enter your phone or WhatsApp number.");}
  if(st===1){if(!role())return e("Please choose how you want to help.");$("sum").textContent="Name: "+$("fn").value+" | Email: "+$("fe").value+" | Phone: "+$("fp").value+" | Country: "+($("fc").value||"-")+" | Role: "+role()}
  if(st===2){if(!$("fk").checked)return e("Please tick the box to agree.");
    const d={name:$("fn").value,email:$("fe").value,phone:$("fp").value,country:$("fc").value,role:role(),message:$("fm").value};
    if(CONFIG.formEndpoint){try{const r=await fetch(CONFIG.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(d)});if(!r.ok)throw 0;$("doneMsg").textContent="Thank you, "+d.name+". We received your details and will contact you soon."}catch(x){return e("Could not send. Please check your internet and try again.")}}
    else{$("doneMsg").textContent="Thank you, "+d.name+". Press OK on WhatsApp to send your details to us.";wa("Hello STEP UP HUB! I want to join. Name: "+d.name+", Email: "+d.email+", Phone: "+d.phone+", Country: "+(d.country||"-")+", I want to: "+d.role+(d.message?". Message: "+d.message:""))}}
  go(st+1)};
$("back").onclick=()=>go(st-1);
// pages
const PAGES=["home","programs","gallery","children","sponsor","join"];
function route(){const h=location.hash.slice(1)||"home",el=document.getElementById(h);
  const pg=PAGES.includes(h)?h:((el&&el.closest("[data-page]"))||{dataset:{page:"home"}}).dataset.page;
  document.querySelectorAll("[data-page]").forEach(x=>x.classList.toggle("on",x.dataset.page===pg));
  document.querySelectorAll("nav ul a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+pg&&!a.classList.contains("navjoin")));
  if(h===pg||!el)scrollTo(0,0);else el.scrollIntoView()}
addEventListener("hashchange",route);
// photo fallback: shows a grey placeholder until you add the real image
const ph=t=>"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#cfe3d6"/><text x="400" y="300" font-family="sans-serif" font-size="30" fill="#17603F" text-anchor="middle">'+t.replace(/&/g,"&amp;")+'</text><text x="400" y="345" font-family="sans-serif" font-size="22" fill="#17603F" text-anchor="middle">(add your photo to the images folder)</text></svg>');
function fixImgs(r){r.querySelectorAll("img[data-ph]").forEach(i=>{const f=()=>{i.onerror=null;i.src=ph(i.dataset.ph)};i.onerror=f;if(i.complete&&!i.naturalWidth)f()})}
fixImgs(document);showGal("All");route();
calc();
