import { useState } from "react";
import TipsPage from "./Tips";

const C={bg:"#0C1409",card:"#141E11",card2:"#1C2818",line:"#2A3825",ink:"#E8DFB8",muted:"#7A9070",lime:"#6DBF4A",limeD:"#1A3010",limeDk:"#3A7020",clay:"#C97B2A",clayD:"#2A1A08",red:"#E05252",redD:"#2A1010",yellow:"#F0C040",yellowD:"#2A2008",blue:"#4A9EFF",blueD:"#0D1E35"};

async function callAI(prompt,max=4000){
  let r;
  try{r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt,max_tokens:max})});}
  catch{throw new Error("Network error â€” check your internet.");}
  if(!r.ok){let e=await r.json().catch(()=>({}));throw new Error(e.error||"Server error");}
  const d=await r.json(),txt=(d.content||[]).map(i=>i.text||"").join("").trim();
  const cl=txt.replace(/^```json\s*/i,"").replace(/```\s*$/i,"").trim();
  const s=cl.indexOf("{"),e=cl.lastIndexOf("}");
  if(s<0||e<0)throw new Error("Invalid AI response. Try again.");
  try{return JSON.parse(cl.slice(s,e+1));}catch{throw new Error("Parse error. Try again.");}
}

const G=`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Syne:wght@800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:${C.bg};color:${C.ink};font-family:'Space Grotesk',system-ui,sans-serif;min-height:100vh;}
button,input,select{font-family:inherit;cursor:pointer;}
.nav{position:sticky;top:0;z-index:100;background:${C.bg}DD;backdrop-filter:blur(10px);border-bottom:1px solid ${C.line};padding:0 16px;display:flex;align-items:center;height:54px;}
.nav-logo{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:${C.lime};flex:1;cursor:pointer;}
.nav-logo span{color:${C.ink};}
.nav-links{display:flex;gap:2px;}
.nl{padding:6px 10px;border-radius:8px;font-size:12px;font-weight:700;color:${C.muted};text-transform:uppercase;background:none;border:none;}
.nl.on,.nl:hover{color:${C.lime};background:${C.limeD};}
.nav-mob{display:none;}
@media(max-width:600px){.nav-links{display:none;}.nav-mob{display:flex;gap:2px;}.nm{padding:5px 7px;font-size:10px;font-weight:700;color:${C.muted};background:none;border:none;text-transform:uppercase;}.nm.on{color:${C.lime};}}
.hero{padding:44px 20px 36px;text-align:center;background:radial-gradient(ellipse at 50% 0%,#1A3A10,${C.bg} 65%);}
.eyebrow{display:inline-block;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:${C.lime};font-weight:800;border:1px solid ${C.limeDk};background:${C.limeD};border-radius:20px;padding:5px 14px;margin-bottom:16px;}
.htitle{font-family:'Syne',sans-serif;font-size:clamp(28px,8vw,50px);font-weight:800;line-height:1.05;letter-spacing:-.03em;margin-bottom:14px;}
.htitle .hl{color:${C.lime};}
.hsub{font-size:14px;color:${C.muted};line-height:1.7;max-width:340px;margin:0 auto 24px;}
.hcta{padding:14px 28px;background:${C.lime};color:#0A1A06;font-size:15px;font-weight:800;border-radius:12px;border:none;}
.hstats{display:flex;margin-top:32px;border:1px solid ${C.line};border-radius:14px;overflow:hidden;background:${C.card};}
.hs{flex:1;padding:14px 6px;text-align:center;border-right:1px solid ${C.line};}
.hs:last-child{border-right:none;}
.hsv{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:${C.lime};}
.hsl{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};margin-top:3px;}
.tgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:20px;}
.tc{background:${C.card};border:1px solid ${C.line};border-radius:14px;padding:16px 14px;cursor:pointer;transition:border .2s;}
.tc:hover{border-color:${C.lime};}
.ti{font-size:26px;margin-bottom:8px;}
.tn{font-family:'Syne',sans-serif;font-size:14px;font-weight:800;margin-bottom:4px;}
.td{font-size:12px;color:${C.muted};line-height:1.5;}
.phdr{padding:22px 20px 0;}
.phdr h2{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px;}
.phdr p{font-size:13px;color:${C.muted};}
.fcard{background:${C.card};border:1px solid ${C.line};border-radius:16px;padding:20px;margin:14px 20px;}
.fl{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:${C.muted};margin-bottom:7px;}
.fi{width:100%;background:${C.card2};border:1px solid ${C.line};border-radius:10px;padding:12px 14px;color:${C.ink};font-size:15px;outline:none;}
.fi:focus{border-color:${C.lime};}
.fi option{background:${C.card2};}
.frow{display:flex;gap:10px;}
.frow .ff{flex:1;}
.ff{margin-bottom:14px;}
.og{display:flex;gap:7px;flex-wrap:wrap;}
.oo{flex:1;min-width:calc(50% - 4px);padding:10px 8px;border-radius:10px;background:${C.card2};border:2px solid ${C.line};text-align:center;font-size:12px;font-weight:700;color:${C.muted};cursor:pointer;line-height:1.4;}
.oo.sel{background:${C.limeD};border-color:${C.lime};color:${C.lime};}
.oi{font-size:18px;display:block;margin-bottom:3px;}
.gbtn{width:100%;padding:14px;border-radius:12px;background:${C.lime};border:none;color:#0A1A06;font-size:15px;font-weight:900;margin-top:8px;}
.bbtn{width:100%;padding:12px;border-radius:12px;background:transparent;border:1px solid ${C.line};color:${C.muted};font-size:14px;font-weight:700;margin-top:8px;}
.ring{width:54px;height:54px;border-radius:50%;border:3px solid ${C.line};border-top-color:${C.lime};animation:spin 1s linear infinite;margin:0 auto 14px;}
@keyframes spin{to{transform:rotate(360deg);}}
.lbox{padding:60px 20px;text-align:center;}
.lbox h3{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:6px;}
.lbox p{font-size:13px;color:${C.muted};}
.rhero{background:linear-gradient(135deg,${C.limeD},${C.card2});border:1px solid ${C.limeDk};border-radius:16px;padding:20px;margin:14px 20px 10px;text-align:center;}
.rhn{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:3px;}
.rhs{font-size:11px;color:${C.lime};text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:14px;}
.mr{display:flex;gap:8px;}
.mc{flex:1;background:${C.card};border-radius:10px;padding:10px 6px;text-align:center;}
.mv{font-size:18px;font-weight:900;line-height:1;}
.ml{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};margin-top:3px;}
.tabs{display:flex;gap:5px;overflow-x:auto;padding:0 20px;margin-bottom:10px;}
.tab{flex-shrink:0;padding:7px 14px;border-radius:8px;background:${C.card};border:1px solid ${C.line};font-size:12px;font-weight:800;color:${C.muted};cursor:pointer;}
.tab.on{background:${C.limeD};border-color:${C.lime};color:${C.lime};}
.mcard{background:${C.card};border:1px solid ${C.line};border-radius:12px;padding:13px 15px;margin:0 20px 9px;}
.mh{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.mn{font-size:10px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:${C.lime};}
.mt{font-size:11px;color:${C.muted};}
.pills{display:flex;gap:5px;margin-bottom:9px;flex-wrap:wrap;}
.pill{font-size:11px;padding:3px 8px;border-radius:5px;}
.pk{background:${C.clayD};color:${C.clay};}
.pp{background:${C.limeD};color:${C.lime};}
.pc{background:${C.yellowD};color:${C.yellow};}
.mi2{list-style:none;}
.mi2 li{padding:6px 0;border-bottom:1px solid ${C.line};font-size:14px;}
.mi2 li:last-child{border-bottom:none;}
.mi2 li::before{content:"Â·";color:${C.lime};margin-right:8px;}
.avd{background:${C.redD};border:1px solid ${C.red};border-radius:12px;padding:14px 15px;margin:0 20px 9px;}
.avdt{font-size:10px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:${C.red};margin-bottom:8px;}
.avdi{font-size:13px;color:#E09090;padding:5px 0;border-bottom:1px solid #3A1818;}
.avdi:last-child{border-bottom:none;}
.tbox{background:${C.card2};border:1px solid ${C.line};border-radius:12px;padding:13px 15px;margin:0 20px 9px;font-size:13px;color:${C.muted};line-height:1.6;}
.slbl{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:${C.muted};font-weight:800;margin:12px 20px 8px;display:block;}
.trow{display:flex;justify-content:space-between;align-items:center;background:${C.limeD};border:1px solid ${C.limeDk};border-radius:10px;padding:12px 15px;margin:0 20px 9px;}
.trl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};}
.trv{font-size:14px;font-weight:900;}
.excard{background:${C.card};border:1px solid ${C.line};border-radius:12px;padding:13px 15px;margin:0 20px 9px;}
.exh{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.exn{width:24px;height:24px;border-radius:7px;background:${C.limeD};font-size:11px;font-weight:900;color:${C.lime};display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.exnm{font-size:15px;font-weight:700;flex:1;}
.ext{font-size:10px;padding:2px 7px;border-radius:5px;font-weight:700;}
.etc{background:${C.limeD};color:${C.lime};}
.eti{background:${C.blueD};color:${C.blue};}
.exm{display:flex;gap:8px;margin-bottom:7px;}
.exc{font-size:11px;padding:3px 9px;border-radius:5px;background:${C.card2};color:${C.muted};}
.exnt{font-size:12px;color:${C.muted};background:${C.card2};border-radius:7px;padding:7px 10px;line-height:1.5;}
.bres{text-align:center;padding:22px 20px;background:${C.card};border:1px solid ${C.line};border-radius:16px;margin:14px 20px;}
.bnum{font-family:'Syne',sans-serif;font-size:54px;font-weight:800;line-height:1;margin-bottom:6px;}
.bcat{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px;}
.bbw{height:10px;border-radius:5px;background:${C.card2};margin:12px 0;overflow:hidden;}
.bbf{height:100%;border-radius:5px;transition:width .5s ease;}
.bgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;}
.bgi{background:${C.card2};border:1px solid ${C.line};border-radius:10px;padding:12px;text-align:center;}
.bgv{font-size:16px;font-weight:800;margin-bottom:2px;}
.bgl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};}
.bsc{display:flex;gap:5px;margin-top:10px;flex-wrap:wrap;}
.bsi{flex:1;min-width:70px;padding:6px;border-radius:8px;text-align:center;}
.err{color:${C.red};font-size:12px;margin-top:8px;}
.footer{text-align:center;padding:24px 20px;font-size:11px;color:${C.line};border-top:1px solid ${C.line};margin-top:16px;line-height:1.8;}
`;

function Opt({options,value,onChange}){
  return <div className="og">{options.map(o=><div key={o.v} className={`oo ${value===o.v?"sel":""}`} onClick={()=>onChange(o.v)}><span className="oi">{o.ico}</span>{o.label}</div>)}</div>;
}
function Load({msg}){return <div className="lbox"><div className="ring"/><h3>Generatingâ€¦</h3><p>{msg}</p></div>;}

const PAGES=[{id:"home",l:"Home"},{id:"diet",l:"Diet"},{id:"workout",l:"Workout"},{id:"bmi",l:"BMI"},{id:"tips",l:"Tips"}];
function Navbar({page,setPage}){
  return <nav className="nav">
    <div className="nav-logo" onClick={()=>setPage("home")}>Sehat<span>AI</span></div>
    <div className="nav-links">{PAGES.map(p=><button key={p.id} className={`nl ${page===p.id?"on":""}`} onClick={()=>setPage(p.id)}>{p.l}</button>)}</div>
    <div className="nav-mob">{PAGES.filter(p=>p.id!=="home").map(p=><button key={p.id} className={`nm ${page===p.id?"on":""}`} onClick={()=>setPage(p.id)}>{p.l}</button>)}</div>
  </nav>;
}

function Home({go}){
  const tools=[{id:"diet",i:"ðŸ¥—",n:"Diet Planner",d:"7-day personalised Indian meal plan"},{id:"workout",i:"ðŸ‹ï¸",n:"Workout Planner",d:"Weekly gym or home workout program"},{id:"bmi",i:"âš–ï¸",n:"BMI Calculator",d:"BMI, ideal weight & calorie needs"},{id:"tips",i:"ðŸ“–",n:"Health Tips",d:"Free articles on nutrition & fitness"}];
  return <div>
    <div className="hero">
      <div className="eyebrow">100% Free Â· AI-Powered Â· No Login</div>
      <h1 className="htitle">Get fit with a plan<br/>made <span className="hl">just for you</span></h1>
      <p className="hsub">Free personalized diet and workout plans for every Indian â€” any budget, any city.</p>
      <button className="hcta" onClick={()=>go("diet")}>Create My Diet Plan â†’</button>
      <div className="hstats">
        <div className="hs"><div className="hsv">100%</div><div className="hsl">Free</div></div>
        <div className="hs"><div className="hsv">4</div><div className="hsl">Tools</div></div>
        <div className="hs"><div className="hsv">AI</div><div className="hsl">Powered</div></div>
        <div className="hs"><div className="hsv">ðŸ‡®ðŸ‡³</div><div className="hsl">Indian</div></div>
      </div>
    </div>
    <div className="tgrid">{tools.map(t=><div key={t.id} className="tc" onClick={()=>go(t.id)}><div className="ti">{t.i}</div><div className="tn">{t.n}</div><div className="td">{t.d}</div></div>)}</div>
    <div style={{margin:"0 20px 20px",background:C.limeD,border:`1px solid ${C.limeDk}`,borderRadius:14,padding:"16px",textAlign:"center"}}>
      <div style={{fontSize:13,color:C.lime,fontWeight:700,marginBottom:6}}>ðŸŒ± Built for people who can't afford a nutritionist</div>
      <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>Uses real Indian foods â€” dal, roti, sabzi, eggs â€” plans that work for your life and budget.</div>
    </div>
  </div>;
}

const GD=[{v:"fat_loss",ico:"ðŸ”¥",label:"Lose fat"},{v:"muscle",ico:"ðŸ’ª",label:"Build muscle"},{v:"both",ico:"âš¡",label:"Both"},{v:"healthy",ico:"ðŸ¥—",label:"Eat healthy"}];
const DT=[{v:"nonveg",ico:"ðŸ—",label:"Non-veg"},{v:"eggetarian",ico:"ðŸ¥š",label:"Eggetarian"},{v:"veg",ico:"ðŸŒ¿",label:"Vegetarian"}];
const BU=[{v:"low",ico:"ðŸª™",label:"Low <â‚¹80"},{v:"medium",ico:"ðŸ’µ",label:"â‚¹80â€“150"},{v:"high",ico:"ðŸ’³",label:"â‚¹150+"}];
const GN=[{v:"male",ico:"ðŸ‘¦",label:"Male"},{v:"female",ico:"ðŸ‘§",label:"Female"}];
const AC=[{v:"none",ico:"ðŸ›‹ï¸",label:"No exercise"},{v:"home",ico:"ðŸ ",label:"Home workout"},{v:"gym",ico:"ðŸ‹ï¸",label:"Gym"}];

function Diet(){
  const [st,setSt]=useState(0),[form,setF]=useState({name:"",age:"",weight:"",height:"",gender:"male",goal:"fat_loss",diet:"nonveg",activity:"gym",budget:"medium"}),[load,setLoad]=useState(false),[plan,setPlan]=useState(null),[err,setErr]=useState(""),[ad,setAd]=useState(0);
  const upd=(k,v)=>setF(f=>({...f,[k]:v}));
  function val(){
    if(!form.age||!form.weight||!form.height)return"Fill age, weight and height.";
    if(isNaN(form.age)||form.age<10||form.age>80)return"Valid age: 10â€“80.";
    if(isNaN(form.weight)||form.weight<30||form.weight>200)return"Valid weight: 30â€“200 kg.";
    if(isNaN(form.height)||form.height<120||form.height>220)return"Valid height: 120â€“220 cm.";
    return"";
  }
  async function gen(){
    setLoad(true);setErr("");
    const bmr=form.gender==="male"?88.36+(13.4*+form.weight)+(4.8*+form.height)-(5.7*+form.age):447.6+(9.2*+form.weight)+(3.1*+form.height)-(4.3*+form.age);
    const mult={none:1.2,home:1.4,gym:1.55};
    const tgt=form.goal==="muscle"?Math.round(bmr*mult[form.activity])+200:Math.max(Math.round(bmr*mult[form.activity])-400,1400);
    const gm={fat_loss:"fat loss",muscle:"muscle building",both:"fat loss + muscle",healthy:"healthy eating"};
    const dm={nonveg:"non-vegetarian",eggetarian:"eggetarian (eggs, no meat)",veg:"vegetarian"};
    const bm={low:"under â‚¹80/day",medium:"â‚¹80â€“150/day",high:"â‚¹150+/day"};
    const prompt=`Indian nutritionist. 7-day diet plan. Age ${form.age}, ${form.gender}, ${form.weight}kg, ${form.height}cm. Goal: ${gm[form.goal]}. Diet: ${dm[form.diet]}. Budget: ${bm[form.budget]}. Target: ~${tgt} kcal/day. Return ONLY valid JSON: {"summary":{"calories":${tgt},"protein":"Xg","cost":"â‚¹X/day","goal":"description"},"keyFoods":["f1","f2","f3","f4"],"avoid":["a1","a2","a3","a4","a5"],"tips":["t1","t2","t3"],"days":[{"day":"Monday","meals":[{"name":"Breakfast","time":"7:30 AM","items":["item1","item2"],"kcal":400,"protein":"25g","cost":"â‚¹22"},{"name":"Mid-Morning","time":"10:30 AM","items":["item1"],"kcal":150,"protein":"5g","cost":"â‚¹8"},{"name":"Lunch","time":"1:00 PM","items":["item1","item2","item3"],"kcal":550,"protein":"40g","cost":"â‚¹35"},{"name":"Evening Snack","time":"4:30 PM","items":["item1"],"kcal":120,"protein":"6g","cost":"â‚¹8"},{"name":"Dinner","time":"7:30 PM","items":["item1","item2"],"kcal":480,"protein":"30g","cost":"â‚¹28"}],"total":{"kcal":${tgt},"protein":"104g","cost":"â‚¹95"}}]} Include all 7 days. Real Indian foods only.`;
    try{const p=await callAI(prompt);setPlan(p);setSt(2);setAd(0);}
    catch(e){setErr(e.message||"Failed. Try again.");}
    setLoad(false);
  }
  if(load)return <Load msg="Building your personalised Indian diet planâ€¦"/>;
  if(plan&&st===2)return <div>
    <div className="phdr"><div className="eyebrow">Your Plan</div><h2>{form.name?`${form.name}'s Plan`:"Your 7-Day Plan"}</h2></div>
    <div className="rhero"><div className="rhn">{form.name||"Your"} Diet Plan</div><div className="rhs">{plan.summary?.goal}</div>
      <div className="mr">
        <div className="mc"><div className="mv" style={{color:C.clay}}>{plan.summary?.calories}</div><div className="ml">kcal</div></div>
        <div className="mc"><div className="mv" style={{color:C.lime}}>{plan.summary?.protein}</div><div className="ml">Protein</div></div>
        <div className="mc"><div className="mv" style={{color:C.yellow}}>{plan.summary?.cost}</div><div className="ml">Cost</div></div>
      </div>
    </div>
    <span className="slbl">Key foods</span>
    <div style={{display:"flex",gap:7,flexWrap:"wrap",padding:"0 20px",marginBottom:12}}>
      {(plan.keyFoods||[]).map((f,i)=><span key={i} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,background:C.limeD,border:`1px solid ${C.limeDk}`,color:C.lime}}>ðŸŒ¿ {f}</span>)}
    </div>
    <span className="slbl">Tap a day</span>
    <div className="tabs">{(plan.days||[]).map((d,i)=><div key={i} className={`tab ${i===ad?"on":""}`} onClick={()=>setAd(i)}>{d.day?.slice(0,3).toUpperCase()}</div>)}</div>
    {(plan.days?.[ad]?.meals||[]).map((m,i)=><div key={i} className="mcard">
      <div className="mh"><span className="mn">{m.name}</span><span className="mt">{m.time}</span></div>
      <div className="pills">{m.kcal&&<span className="pill pk">{m.kcal} kcal</span>}{m.protein&&<span className="pill pp">{m.protein}</span>}{m.cost&&<span className="pill pc">{m.cost}</span>}</div>
      <ul className="mi2">{(m.items||[]).map((it,j)=><li key={j}>{it}</li>)}</ul>
    </div>)}
    {plan.days?.[ad]?.total&&<div className="trow"><span className="trl">Day Total</span><div style={{display:"flex",gap:10}}><span className="trv" style={{color:C.clay}}>{plan.days[ad].total.kcal} kcal</span><span className="trv" style={{color:C.lime}}>{plan.days[ad].total.protein}</span><span className="trv" style={{color:C.yellow}}>{plan.days[ad].total.cost}</span></div></div>}
    <div className="avd"><div className="avdt">âŒ Always Avoid</div>{(plan.avoid||[]).map((a,i)=><div key={i} className="avdi">âœ— {a}</div>)}</div>
    <div className="tbox">{(plan.tips||[]).map((t,i)=><div key={i} style={{marginBottom:6}}>ðŸ’¡ {t}</div>)}</div>
    <div style={{padding:"0 20px"}}><button className="bbtn" onClick={()=>{setPlan(null);setSt(0);}}>â† New plan</button></div>
  </div>;
  return <div>
    <div className="phdr"><div className="eyebrow">Step {st+1} of 2</div><h2>{st===0?"About you":"Goal & preferences"}</h2><p>{st===0?"We calculate your exact calorie needs.":"We pick the right foods for you."}</p></div>
    <div className="fcard">
      {st===0&&<><div className="ff"><label className="fl">Name (optional)</label><input className="fi" placeholder="e.g. Rahul" value={form.name} onChange={e=>upd("name",e.target.value)}/></div>
        <div className="frow"><div className="ff"><label className="fl">Age</label><input className="fi" type="number" inputMode="numeric" placeholder="22" value={form.age} onChange={e=>upd("age",e.target.value)}/></div>
        <div className="ff"><label className="fl">Gender</label><Opt options={GN} value={form.gender} onChange={v=>upd("gender",v)}/></div></div>
        <div className="frow"><div className="ff"><label className="fl">Weight (kg)</label><input className="fi" type="number" inputMode="numeric" placeholder="22" value={form.age} onChange={e=>upd("age",e.target.value)}/></div>
      <div className="ff"><label className="fl">Gender</label><Opt options={GN} value={form.gender} onChange={v=>upd("gender",v)}/></div></div>
      {err&&<div className="err">âš ï¸ {err}</div>}
      <button className="gbtn" onClick={calc}>Calculate My BMI</button>
    </div>
    {res&&<>
      <div className="bres">
        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".12em",color:C.muted,marginBottom:8}}>Your BMI</div>
        <div className="bnum" style={{color:res.color}}>{res.bmi}</div>
        <div className="bcat" style={{color:res.color}}>{res.cat}</div>
        <div className="bbw"><div className="bbf" style={{width:`${res.pct}%`,background:res.color}}/></div>
        <div className="bsc">{[["<18.5","Under",C.blue],["18.5â€“23","Healthy",C.lime],["23â€“25","Over",C.yellow],["25+","Obese",C.red]].map(([r,l,col])=><div key={r} className="bsi" style={{background:`${col}22`,color:col}}><div style={{fontSize:12,fontWeight:900}}>{r}</div><div style={{fontSize:9}}>{l}</div></div>)}</div>
        <div className="bgrid">
          <div className="bgi"><div className="bgv" style={{color:C.lime}}>{res.il}â€“{res.ih} kg</div><div className="bgl">Ideal weight</div></div>
          <div className="bgi"><div className="bgv" style={{color:C.clay}}>{res.maint} kcal</div><div className="bgl">Maintenance</div></div>
          <div className="bgi"><div className="bgv" style={{color:C.yellow}}>{res.bmr} kcal</div><div className="bgl">BMR at rest</div></div>
          <div className="bgi"><div className="bgv" style={{color:res.tolose>0?C.red:C.lime}}>{res.tolose>0?`${res.tolose} kg to lose`:"In range âœ“"}</div><div className="bgl">Weight goal</div></div>
        </div>
      </div>
      <div className="tbox" style={{margin:"0 20px 16px"}}><b style={{color:C.lime}}>Note:</b> Asian BMI cutoffs are lower than Western standards because Indians carry more health risk at lower BMI values.</div>
    </>}
  </div>;
}
export default function App(){
  const [page,setPage]=useState("home");
  const go=(p)=>{setPage(p);window.scrollTo(0,0);};
  return <>
    <style>{G}</style>
    <Navbar page={page} setPage={go}/>
    <div style={{paddingBottom:40}}>
      {page==="home"&&<Home go={go}/>}
      {page==="diet"&&<Diet/>}
      {page==="workout"&&<Workout/>}
      {page==="bmi"&&<BMI/>}
      {page==="tips"&&<TipsPage/>}
    </div>
    <footer className="footer">
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:C.lime,marginBottom:8}}>Sehat<span style={{color:C.ink}}>AI</span></div>
      Free personalised diet & workout plans for every Indian.<br/>
      <div style={{marginTop:8,display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
        {PAGES.map(p=><span key={p.id} style={{cursor:"pointer",color:C.muted}} onClick={()=>go(p.id)}>{p.l}</span>)}
      </div>
      <div style={{marginTop:10}}>ðŸŒ± Free forever Â· No login Â· AI-generated plans are for general guidance.</div>
    </footer>
  </>;
} 
