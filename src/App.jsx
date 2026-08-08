import { useState } from "react";

// ── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg:"#0C1409",card:"#141E11",card2:"#1C2818",line:"#2A3825",
  ink:"#E8DFB8",muted:"#7A9070",faint:"#2A3825",
  lime:"#6DBF4A",limeD:"#1A3010",limeDk:"#3A7020",
  clay:"#C97B2A",clayD:"#2A1A08",
  red:"#E05252",redD:"#2A1010",
  yellow:"#F0C040",yellowD:"#2A2008",
  blue:"#4A9EFF",blueD:"#0D1E35",
};

// ── SECURE AI HELPER ─────────────────────────────────────────────────────────
// Calls /api/generate (our Vercel serverless function) — keeps API key hidden.
async function callAI(prompt, maxTokens = 4000) {
  let res;
  try {
    res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, max_tokens: maxTokens }),
    });
  } catch (networkErr) {
    throw new Error("Network error — check your internet connection.");
  }

  if (!res.ok) {
    let errMsg = `Server error (${res.status})`;
    try { const e = await res.json(); errMsg = e.error || errMsg; } catch {}
    throw new Error(errMsg);
  }

  const data = await res.json();
  const txt = (data.content || []).map(i => i.text || "").join("").trim();

  // Strip markdown code fences if present
  const clean = txt
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  // Find first { and last } to extract JSON even if there's extra text
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Invalid response from AI. Please try again.");

  try {
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    throw new Error("Could not parse AI response. Please try again.");
  }
}

// ── GLOBAL CSS ───────────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Syne:wght@700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:${C.bg};color:${C.ink};font-family:'Space Grotesk',system-ui,sans-serif;min-height:100vh;}
button,input,select{font-family:inherit;cursor:pointer;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:${C.card};}
::-webkit-scrollbar-thumb{background:${C.line};border-radius:2px;}

.nav{position:sticky;top:0;z-index:100;background:${C.bg}CC;backdrop-filter:blur(12px);
  border-bottom:1px solid ${C.line};padding:0 16px;display:flex;align-items:center;height:56px;}
.nav-logo{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:${C.lime};
  letter-spacing:-.02em;flex:1;cursor:pointer;}
.nav-logo span{color:${C.ink};}
.nav-links{display:flex;gap:2px;}
.nav-link{padding:6px 10px;border-radius:8px;font-size:12px;font-weight:700;color:${C.muted};
  letter-spacing:.04em;text-transform:uppercase;background:none;border:none;transition:all .2s;}
.nav-link:hover,.nav-link.active{color:${C.lime};background:${C.limeD};}
.nav-mob{display:none;}

@media(max-width:600px){
  .nav-links{display:none;}
  .nav-mob{display:flex;gap:2px;}
  .nav-mob-btn{padding:6px 8px;border-radius:8px;font-size:10px;font-weight:700;
    color:${C.muted};background:none;border:none;letter-spacing:.04em;text-transform:uppercase;}
  .nav-mob-btn.active{color:${C.lime};}
}

.hero-section{padding:48px 20px 40px;text-align:center;
  background:radial-gradient(ellipse at 50% 0%,#1A3A10 0%,${C.bg} 65%);}
.eyebrow{display:inline-block;font-size:10px;letter-spacing:.2em;text-transform:uppercase;
  color:${C.lime};font-weight:800;border:1px solid ${C.limeDk};background:${C.limeD};
  border-radius:20px;padding:5px 14px;margin-bottom:18px;}
.hero-title{font-family:'Syne',sans-serif;font-size:clamp(30px,8vw,52px);font-weight:800;
  line-height:1.05;letter-spacing:-.03em;margin-bottom:16px;}
.hero-title .hl{color:${C.lime};}
.hero-sub{font-size:14px;color:${C.muted};line-height:1.7;max-width:360px;margin:0 auto 28px;}
.hero-cta{display:inline-block;padding:15px 30px;background:${C.lime};color:#0A1A06;
  font-size:15px;font-weight:800;border-radius:12px;border:none;}
.hero-stats{display:flex;gap:0;margin-top:36px;border:1px solid ${C.line};
  border-radius:14px;overflow:hidden;background:${C.card};}
.hstat{flex:1;padding:16px 8px;text-align:center;border-right:1px solid ${C.line};}
.hstat:last-child{border-right:none;}
.hstat-val{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:${C.lime};}
.hstat-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};margin-top:3px;}

.tools-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:20px;}
.tool-card{background:${C.card};border:1px solid ${C.line};border-radius:14px;
  padding:18px 14px;cursor:pointer;transition:all .2s;text-align:left;}
.tool-card:hover{border-color:${C.lime};background:${C.limeD};}
.tool-ico{font-size:28px;margin-bottom:10px;}
.tool-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin-bottom:4px;}
.tool-desc{font-size:12px;color:${C.muted};line-height:1.5;}

.step-card{display:flex;gap:14px;padding:14px;background:${C.card};
  border:1px solid ${C.line};border-radius:12px;margin-bottom:10px;align-items:flex-start;}
.step-num{width:32px;height:32px;border-radius:10px;background:${C.limeD};border:1px solid ${C.limeDk};
  color:${C.lime};font-size:13px;font-weight:900;display:flex;align-items:center;
  justify-content:center;flex-shrink:0;}
.step-text{font-size:14px;line-height:1.5;}
.step-text b{color:${C.lime};display:block;margin-bottom:2px;}

.page-wrap{padding:0 0 40px;}
.page-hdr{padding:24px 20px 0;}
.page-hdr h2{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px;}
.page-hdr p{font-size:13px;color:${C.muted};}

.form-card{background:${C.card};border:1px solid ${C.line};border-radius:16px;padding:20px;margin:16px 20px;}
.field{margin-bottom:16px;}
.field label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.12em;
  font-weight:800;color:${C.muted};margin-bottom:7px;}
.field input,.field select{width:100%;background:${C.card2};border:1px solid ${C.line};
  border-radius:10px;padding:12px 14px;color:${C.ink};font-size:15px;outline:none;transition:border .2s;}
.field input:focus,.field select:focus{border-color:${C.lime};}
.field select option{background:${C.card2};}
.field-row{display:flex;gap:12px;}
.field-row .field{flex:1;}

.opt-grid{display:flex;gap:7px;flex-wrap:wrap;}
.opt{flex:1;min-width:calc(50% - 4px);padding:11px 8px;border-radius:10px;
  background:${C.card2};border:2px solid ${C.line};text-align:center;
  font-size:12px;font-weight:700;color:${C.muted};cursor:pointer;transition:all .15s;line-height:1.4;}
.opt.sel{background:${C.limeD};border-color:${C.lime};color:${C.lime};}
.opt .oi{font-size:20px;display:block;margin-bottom:4px;}

.gen-btn{width:100%;padding:15px;border-radius:12px;background:${C.lime};border:none;
  color:#0A1A06;font-size:15px;font-weight:900;margin-top:8px;}
.back-btn{width:100%;padding:13px;border-radius:12px;background:transparent;
  border:1px solid ${C.line};color:${C.muted};font-size:14px;font-weight:700;margin-top:8px;}

.ring{width:56px;height:56px;border-radius:50%;border:3px solid ${C.line};
  border-top-color:${C.lime};animation:spin 1s linear infinite;margin:0 auto 16px;}
@keyframes spin{to{transform:rotate(360deg);}}
.loading-box{padding:60px 20px;text-align:center;}
.loading-box h3{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:8px;}
.loading-box p{font-size:13px;color:${C.muted};line-height:1.6;}

.result-hero{background:linear-gradient(135deg,${C.limeD},${C.card2});border:1px solid ${C.limeDk};
  border-radius:16px;padding:20px;margin:16px 20px 10px;text-align:center;}
.rh-name{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:3px;}
.rh-sub{font-size:11px;color:${C.lime};text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:14px;}
.macro-row{display:flex;gap:8px;}
.macro{flex:1;background:${C.card};border-radius:10px;padding:10px 6px;text-align:center;}
.mv{font-size:18px;font-weight:900;line-height:1;}
.ml{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};margin-top:3px;}
.mv-lime{color:${C.lime};}
.mv-clay{color:${C.clay};}
.mv-yellow{color:${C.yellow};}

.tabs{display:flex;gap:5px;overflow-x:auto;padding:0 20px;margin-bottom:10px;}
.tab{flex-shrink:0;padding:7px 14px;border-radius:8px;background:${C.card};
  border:1px solid ${C.line};font-size:12px;font-weight:800;color:${C.muted};cursor:pointer;}
.tab.active{background:${C.limeD};border-color:${C.lime};color:${C.lime};}

.meal-card{background:${C.card};border:1px solid ${C.line};border-radius:12px;padding:13px 15px;margin:0 20px 9px;}
.mh{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.mh-name{font-size:10px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:${C.lime};}
.mh-time{font-size:11px;color:${C.muted};}
.pills{display:flex;gap:5px;margin-bottom:9px;flex-wrap:wrap;}
.pill{font-size:11px;padding:3px 8px;border-radius:5px;}
.pk{background:${C.clayD};color:${C.clay};}
.pp{background:${C.limeD};color:${C.lime};}
.pc{background:${C.yellowD};color:${C.yellow};}
.mi{list-style:none;}
.mi li{padding:6px 0;border-bottom:1px solid ${C.line};font-size:14px;}
.mi li:last-child{border-bottom:none;}
.mi li::before{content:"·";color:${C.lime};margin-right:8px;}

.ex-card{background:${C.card};border:1px solid ${C.line};border-radius:12px;padding:13px 15px;margin:0 20px 9px;}
.ex-hdr{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.ex-num{width:24px;height:24px;border-radius:7px;background:${C.limeD};
  font-size:11px;font-weight:900;color:${C.lime};display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ex-name{font-size:15px;font-weight:700;flex:1;}
.ex-tag{font-size:10px;padding:2px 7px;border-radius:5px;font-weight:700;}
.et-c{background:${C.limeD};color:${C.lime};}
.et-i{background:${C.blueD};color:${C.blue};}
.ex-meta{display:flex;gap:8px;margin-bottom:7px;}
.ex-chip{font-size:11px;padding:3px 9px;border-radius:5px;background:${C.card2};color:${C.muted};}
.ex-note{font-size:12px;color:${C.muted};background:${C.card2};border-radius:7px;padding:7px 10px;line-height:1.5;}

.avoid-block{background:${C.redD};border:1px solid ${C.red};border-radius:12px;padding:14px 15px;margin:0 20px 9px;}
.avoid-title{font-size:10px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:${C.red};margin-bottom:8px;}
.avoid-item{font-size:13px;color:#E09090;padding:5px 0;border-bottom:1px solid #3A1818;}
.avoid-item:last-child{border-bottom:none;}

.tip-banner{background:${C.card2};border:1px solid ${C.line};border-radius:12px;
  padding:13px 15px;margin:0 20px 9px;font-size:13px;color:${C.muted};line-height:1.6;}
.tip-banner b{color:${C.lime};}

.section-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:${C.muted};
  font-weight:800;margin:14px 20px 8px;display:block;}
.total-row{display:flex;justify-content:space-between;align-items:center;
  background:${C.limeD};border:1px solid ${C.limeDk};border-radius:10px;padding:12px 15px;margin:0 20px 9px;}
.tr-label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};}
.tr-vals{display:flex;gap:10px;}
.tr-v{font-size:14px;font-weight:900;}

.bmi-result{text-align:center;padding:24px 20px;background:${C.card};
  border:1px solid ${C.line};border-radius:16px;margin:16px 20px;}
.bmi-num{font-family:'Syne',sans-serif;font-size:56px;font-weight:800;line-height:1;margin-bottom:6px;}
.bmi-cat{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px;}
.bmi-bar-wrap{height:10px;border-radius:5px;background:${C.card2};margin:14px 0;overflow:hidden;}
.bmi-bar-fill{height:100%;border-radius:5px;transition:width .6s ease;}
.bmi-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px;}
.bmi-info{background:${C.card2};border:1px solid ${C.line};border-radius:10px;padding:12px;text-align:center;}
.bi-val{font-size:16px;font-weight:800;margin-bottom:2px;}
.bi-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${C.muted};}
.bmi-scale{display:flex;gap:6px;margin-top:12px;flex-wrap:wrap;}
.bmi-scale-item{flex:1;min-width:70px;padding:7px;border-radius:8px;text-align:center;}

.blog-grid{display:grid;grid-template-columns:1fr;gap:10px;padding:16px 20px;}
.blog-card{background:${C.card};border:1px solid ${C.line};border-radius:14px;
  padding:18px;cursor:pointer;transition:all .2s;}
.blog-card:hover{border-color:${C.lime};}
.blog-cat{font-size:10px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:${C.lime};margin-bottom:8px;}
.blog-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;margin-bottom:8px;line-height:1.3;}
.blog-excerpt{font-size:13px;color:${C.muted};line-height:1.6;}
.blog-read{display:inline-block;margin-top:12px;font-size:11px;font-weight:800;color:${C.lime};text-transform:uppercase;letter-spacing:.1em;}
.blog-full{padding:16px 20px;}
.blog-full h2{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-bottom:12px;line-height:1.2;}
.blog-full p{font-size:14px;color:${C.muted};line-height:1.8;margin-bottom:14px;}
.blog-full h3{font-size:15px;font-weight:800;margin:18px 0 8px;}
.blog-full ul{padding-left:18px;}
.blog-full ul li{font-size:14px;color:${C.muted};line-height:1.7;margin-bottom:6px;}
.blog-highlight{background:${C.limeD};border:1px solid ${C.limeDk};border-radius:10px;
  padding:14px;margin:16px 0;font-size:13px;color:${C.lime};line-height:1.6;}

.err{color:${C.red};font-size:12px;margin-top:8px;}
.footer{text-align:center;padding:24px 20px;font-size:11px;color:${C.faint};
  border-top:1px solid ${C.line};line-height:1.8;margin-top:20px;}
`;

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function Opt({ options, value, onChange }) {
  return (
    <div className="opt-grid">
      {options.map(o => (
        <div key={o.v} className={`opt ${value === o.v ? 'sel' : ''}`} onClick={() => onChange(o.v)}>
          <span className="oi">{o.ico}</span>{o.label}
        </div>
      ))}
    </div>
  );
}
function Loading({ msg }) {
  return (
    <div className="loading-box">
      <div className="ring" />
      <h3>Generating your plan…</h3>
      <p>{msg || "Our AI is personalising everything for you."}</p>
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
const PAGES = [
  { id: "home", label: "Home" },
  { id: "diet", label: "Diet" },
  { id: "workout", label: "Workout" },
  { id: "bmi", label: "BMI" },
  { id: "tips", label: "Tips" },
];
function Navbar({ page, setPage }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("home")}>Sehat<span>AI</span></div>
      <div className="nav-links">
        {PAGES.map(p => (
          <button key={p.id} className={`nav-link ${page === p.id ? 'active' : ''}`} onClick={() => setPage(p.id)}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="nav-mob">
        {PAGES.filter(p => p.id !== "home").map(p => (
          <button key={p.id} className={`nav-mob-btn ${page === p.id ? 'active' : ''}`} onClick={() => setPage(p.id)}>
            {p.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const tools = [
    { id: "diet", ico: "🥗", name: "Diet Planner", desc: "7-day personalised Indian meal plan based on your body, goal & budget" },
    { id: "workout", ico: "🏋️", name: "Workout Planner", desc: "Full weekly gym or home workout plan for your fitness level" },
    { id: "bmi", ico: "⚖️", name: "BMI Calculator", desc: "Know your BMI, ideal weight, and calorie needs instantly" },
    { id: "tips", ico: "📖", name: "Health Tips", desc: "Free articles on nutrition, Indian superfoods, fat loss & more" },
  ];
  return (
    <div>
      <div className="hero-section">
        <div className="eyebrow">100% Free · AI-Powered · No Login</div>
        <h1 className="hero-title">Get fit with a plan<br />made <span className="hl">just for you</span></h1>
        <p className="hero-sub">Free personalized diet and workout plans for every Indian — whether you're in a village or a city, on any budget.</p>
        <button className="hero-cta" onClick={() => setPage("diet")}>Create My Diet Plan →</button>
        <div className="hero-stats">
          <div className="hstat"><div className="hstat-val">100%</div><div className="hstat-lbl">Free forever</div></div>
          <div className="hstat"><div className="hstat-val">4</div><div className="hstat-lbl">Free tools</div></div>
          <div className="hstat"><div className="hstat-val">AI</div><div className="hstat-lbl">Powered</div></div>
          <div className="hstat"><div className="hstat-val">🇮🇳</div><div className="hstat-lbl">Indian foods</div></div>
        </div>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Free tools for you</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>No cost. No account. Just results.</div>
      </div>
      <div className="tools-grid">
        {tools.map(t => (
          <div key={t.id} className="tool-card" onClick={() => setPage(t.id)}>
            <div className="tool-ico">{t.ico}</div>
            <div className="tool-name">{t.name}</div>
            <div className="tool-desc">{t.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>How it works</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Three steps, 60 seconds.</div>
        {[
          { n: 1, t: "Tell us about yourself", d: "Enter your age, weight, height and goal." },
          { n: 2, t: "Choose your preferences", d: "Pick your diet type, budget, and activity level." },
          { n: 3, t: "Get your personalised plan", d: "Our AI generates a full 7-day Indian meal plan or workout routine — free." },
        ].map(s => (
          <div key={s.n} className="step-card">
            <div className="step-num">{s.n}</div>
            <div className="step-text"><b>{s.t}</b>{s.d}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: "20px", background: C.limeD, border: `1px solid ${C.limeDk}`, borderRadius: 14, padding: "18px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: C.lime, fontWeight: 700, marginBottom: 6 }}>🌱 Built for people who can't afford a nutritionist</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Most diet apps are expensive or push Western foods. SehatAI uses real Indian foods — dal, roti, sabzi, eggs — to build plans that actually work for your life and budget.</div>
      </div>
    </div>
  );
}

// ── DIET PLANNER ──────────────────────────────────────────────────────────────
const GOALS_D = [
  { v: "fat_loss", ico: "🔥", label: "Lose fat" },
  { v: "muscle", ico: "💪", label: "Build muscle" },
  { v: "both", ico: "⚡", label: "Both" },
  { v: "healthy", ico: "🥗", label: "Eat healthy" },
];
const DIETS = [
  { v: "nonveg", ico: "🍗", label: "Non-veg" },
  { v: "eggetarian", ico: "🥚", label: "Eggetarian" },
  { v: "veg", ico: "🌿", label: "Vegetarian" },
];
const BUDGETS = [
  { v: "low", ico: "🪙", label: "Low\n<₹80/day" },
  { v: "medium", ico: "💵", label: "Medium\n₹80–150" },
  { v: "high", ico: "💳", label: "Flexible\n₹150+" },
];
const GENDERS = [{ v: "male", ico: "👦", label: "Male" }, { v: "female", 
