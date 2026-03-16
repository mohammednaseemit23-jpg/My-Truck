import { useState, useEffect, useRef } from "react";

// ── Seed data derived from the Excel sheet ───────────────────────────────────
const FLEET = [
  { id:"VH-001", reg:"KA01AB1234", make:"Tata", model:"407", year:2020, type:"Mini Truck", capacity:2.5, odometer:145500, ownership:"Owned", rc:"2026-08-31", fitness:"2026-05-31", insurance:"2026-09-30", permit:"2026-12-31", fuel:"Diesel", mileage:14.5, status:"Active", notes:"Primary short-haul" },
  { id:"VH-002", reg:"KA01CD5678", make:"Ashok Leyland", model:"Dost", year:2019, type:"Mini Truck", capacity:1.5, odometer:210000, ownership:"Owned", rc:"2027-01-15", fitness:"2026-11-30", insurance:"2025-12-31", permit:"2026-06-30", fuel:"Diesel", mileage:12.8, status:"Active", notes:"City delivery" },
  { id:"VH-003", reg:"KA02EF9012", make:"Mahindra", model:"Bolero Pik-Up", year:2021, type:"Pickup", capacity:1.0, odometer:87000, ownership:"Leased", rc:"2028-03-10", fitness:"2027-02-28", insurance:"2026-08-15", permit:"2027-01-31", fuel:"Diesel", mileage:16.2, status:"Active", notes:"Rural routes" },
];

const DRIVERS = [
  { id:"DR-001", name:"Ravi Kumar",   phone:"+91-9876543210", license:"KA0120230001234", expiry:"2028-05-15", blood:"B+", joining:"2023-06-01", status:"Active" },
  { id:"DR-002", name:"Suresh Naik",  phone:"+91-9845612345", license:"KA0120190005678", expiry:"2026-11-20", blood:"O+", joining:"2022-01-15", status:"Active" },
  { id:"DR-003", name:"Prakash Gowda",phone:"+91-9731234567", license:"KA0120210009012", expiry:"2027-03-10", blood:"A+", joining:"2024-02-10", status:"Active" },
];

const TRIPS = [
  { id:"TRIP-0001", date:"2026-03-02", vehicle:"VH-001", driver:"DR-001", customer:"ABC Mfg",   route:"Bengaluru→Tumakuru",   load:2.0, dist:75,  rate:850, freight:1700, toll:200, otherIncome:0, fuel_l:5.2, fuelCost:546, driverExp:300, maint:0,   otherExp:50,  totalExp:1096, profit:604 },
  { id:"TRIP-0002", date:"2026-03-05", vehicle:"VH-002", driver:"DR-002", customer:"XYZ Traders","route":"Bengaluru→Mysuru",   load:1.5, dist:145, rate:900, freight:1350, toll:350, otherIncome:0, fuel_l:11.3,fuelCost:1187,driverExp:500, maint:200, otherExp:100, totalExp:2037, profit:-337 },
  { id:"TRIP-0003", date:"2026-03-08", vehicle:"VH-003", driver:"DR-003", customer:"PQR Exports", route:"Bengaluru→Hosur",    load:0.8, dist:40,  rate:950, freight:760,  toll:100, otherIncome:0, fuel_l:2.5, fuelCost:262, driverExp:200, maint:0,   otherExp:0,   totalExp:562,  profit:198 },
  { id:"TRIP-0004", date:"2026-03-10", vehicle:"VH-001", driver:"DR-001", customer:"ABC Mfg",   route:"Bengaluru→Tumakuru",   load:2.5, dist:75,  rate:850, freight:2125, toll:200, otherIncome:50,fuel_l:5.5, fuelCost:577, driverExp:300, maint:0,   otherExp:50,  totalExp:1127, profit:1048},
  { id:"TRIP-0005", date:"2026-03-12", vehicle:"VH-002", driver:"DR-002", customer:"LMN Corp",  route:"Bengaluru→Kolar",      load:1.2, dist:65,  rate:800, freight:960,  toll:150, otherIncome:0, fuel_l:5.1, fuelCost:535, driverExp:250, maint:0,   otherExp:50,  totalExp:985,  profit:125 },
];

const FUEL = [
  { date:"2026-03-02", vehicle:"VH-001", odo:145500, litres:30, rate:105, cost:3150, station:"HP Fuel Station", inv:"INV-001" },
  { date:"2026-03-05", vehicle:"VH-002", odo:209950, litres:45, rate:105, cost:4725, station:"BPCL Pump",        inv:"INV-002" },
  { date:"2026-03-08", vehicle:"VH-003", odo:86960,  litres:20, rate:105, cost:2100, station:"HP Fuel Station",  inv:"INV-003" },
];

const MAINTENANCE = [
  { date:"2026-03-02", vehicle:"VH-001", odo:145600, vendor:"Tata Service",  cat:"Servicing", desc:"Oil & filter change", parts:800,  labour:500, total:1300, nextDue:"2026-09-01" },
  { date:"2026-03-06", vehicle:"VH-002", odo:210050, vendor:"AL Workshop",   cat:"Tyres",     desc:"Front tyre replacement", parts:4500,labour:200, total:4700, nextDue:"2027-03-06" },
];

const COMPLIANCE = [
  { entity:"Vehicle", id:"VH-001", doc:"Insurance",  no:"INS2025001", issue:"2025-10-01", expiry:"2026-09-30", days:30, status:"Active" },
  { entity:"Vehicle", id:"VH-001", doc:"Fitness",    no:"FC2025001",  issue:"2025-06-01", expiry:"2026-05-31", days:30, status:"Active" },
  { entity:"Vehicle", id:"VH-002", doc:"Insurance",  no:"INS2024002", issue:"2024-12-01", expiry:"2025-12-31", days:30, status:"Expired" },
  { entity:"Vehicle", id:"VH-002", doc:"Permit",     no:"PRMT002",    issue:"2025-06-01", expiry:"2026-06-30", days:30, status:"Active" },
  { entity:"Driver",  id:"DR-002", doc:"License",    no:"KA0120190005678", issue:"2016-11-20", expiry:"2026-11-20", days:60, status:"Active" },
  { entity:"Vehicle", id:"VH-003", doc:"Insurance",  no:"INS2025003", issue:"2025-08-15", expiry:"2026-08-15", days:30, status:"Active" },
];

const INVOICES = [
  { no:"INV-1001", date:"2026-03-02", customer:"ABC Mfg",    trip:"TRIP-0001", desc:"Freight – Bengaluru to Tumakuru", qty:2.0, rate:850, sub:1700, gst:5, gstAmt:85,  total:1785, due:"2026-04-01", status:"Unpaid" },
  { no:"INV-1002", date:"2026-03-05", customer:"XYZ Traders",trip:"TRIP-0002", desc:"Freight – Bengaluru to Mysuru",   qty:1.5, rate:900, sub:1350, gst:5, gstAmt:67.5,total:1417.5,due:"2026-04-04", status:"Unpaid" },
  { no:"INV-1003", date:"2026-03-08", customer:"PQR Exports", trip:"TRIP-0003", desc:"Freight – Bengaluru to Hosur",    qty:0.8, rate:950, sub:760,  gst:5, gstAmt:38,  total:798,  due:"2026-04-07", status:"Paid"   },
  { no:"INV-1004", date:"2026-03-10", customer:"ABC Mfg",    trip:"TRIP-0004", desc:"Freight – Bengaluru to Tumakuru", qty:2.5, rate:850, sub:2125, gst:5, gstAmt:106.25,total:2231.25,due:"2026-04-09", status:"Unpaid"},
];

// ── Palette / Theme ──────────────────────────────────────────────────────────
const C = {
  bg:"#0d1117", surface:"#161b22", card:"#1c2430",
  amber:"#f0a500", amberDim:"#8a5e00",
  green:"#3fb950", red:"#f85149", blue:"#58a6ff",
  muted:"#8b949e", border:"#30363d",
  text:"#e6edf3", textDim:"#8b949e",
};

// ── Tiny helpers ─────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(n);
const today = new Date("2026-03-16");

function daysUntil(dateStr){
  return Math.round((new Date(dateStr) - today) / 86400000);
}

function complianceColor(expiry){
  const d = daysUntil(expiry);
  if(d < 0) return C.red;
  if(d < 30) return "#f97316";
  if(d < 60) return "#facc15";
  return C.green;
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KPI({label, value, sub, accent}){
  return (
    <div style={{background:C.card,borderRadius:12,padding:"20px 24px",border:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:6}}>
      <span style={{fontSize:12,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",fontFamily:"'DM Mono',monospace"}}>{label}</span>
      <span style={{fontSize:28,fontWeight:700,color:accent||C.text,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>{value}</span>
      {sub && <span style={{fontSize:12,color:C.muted}}>{sub}</span>}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHead({icon,title,badge}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
      <span style={{fontSize:20}}>{icon}</span>
      <h2 style={{margin:0,fontSize:16,fontWeight:700,color:C.text,fontFamily:"'Space Grotesk',sans-serif"}}>{title}</h2>
      {badge && <span style={{marginLeft:"auto",fontSize:11,background:C.amberDim,color:C.amber,padding:"2px 8px",borderRadius:20,fontFamily:"'DM Mono',monospace"}}>{badge}</span>}
    </div>
  );
}

// ── Tag ───────────────────────────────────────────────────────────────────────
function Tag({label,color}){
  const bg = color==="green"?"#1a3a2a":color==="red"?"#3a1a1a":color==="amber"?"#3a2a0a":"#1a2a3a";
  const fg = color==="green"?C.green:color==="red"?C.red:color==="amber"?C.amber:C.blue;
  return <span style={{fontSize:11,background:bg,color:fg,padding:"2px 8px",borderRadius:6,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>{label}</span>;
}

// ── Table ─────────────────────────────────────────────────────────────────────
function Table({cols,rows}){
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,color:C.text}}>
        <thead>
          <tr>{cols.map(c=><th key={c.key} style={{padding:"8px 12px",textAlign:"left",color:C.muted,fontWeight:500,borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.05em"}}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${C.border}20`}}>
              {cols.map(c=>(
                <td key={c.key} style={{padding:"10px 12px",whiteSpace:"nowrap"}}>{c.render ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── AI Insights Panel ─────────────────────────────────────────────────────────
function AIInsights(){
  const [prompt,setPrompt] = useState("");
  const [messages,setMessages] = useState([
    {role:"assistant",text:"Hello! I'm your My Truck AI assistant. Ask me anything about your fleet performance, trip profitability, compliance status, or fuel efficiency."}
  ]);
  const [loading,setLoading] = useState(false);
  const endRef = useRef();

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const context = `
You are My Truck AI, an expert transport business analyst for an Indian logistics company.
Current data summary:
- Fleet: ${FLEET.length} vehicles (${FLEET.filter(v=>v.status==="Active").length} active)
- Trips this month: ${TRIPS.length}, Total Revenue: ₹${fmt(TRIPS.reduce((s,t)=>s+t.freight+t.otherIncome,0))}, Total Profit: ₹${fmt(TRIPS.reduce((s,t)=>s+t.profit,0))}
- Pending invoices: ${INVOICES.filter(i=>i.status==="Unpaid").length} (₹${fmt(INVOICES.filter(i=>i.status==="Unpaid").reduce((s,i)=>s+i.total,0))})
- Expired compliance docs: ${COMPLIANCE.filter(c=>daysUntil(c.expiry)<0).length}
- Expiring within 60 days: ${COMPLIANCE.filter(c=>{ const d=daysUntil(c.expiry); return d>=0&&d<60; }).length}
- Avg fuel efficiency: ${(FLEET.reduce((s,v)=>s+v.mileage,0)/FLEET.length).toFixed(1)} KMPL
- Vehicle VH-002 insurance has EXPIRED - needs immediate renewal
Respond concisely and helpfully. Use ₹ for currency, mention specific IDs when relevant.
  `;

  async function send(){
    if(!prompt.trim()) return;
    const userMsg = prompt.trim();
    setPrompt("");
    setMessages(prev=>[...prev,{role:"user",text:userMsg}]);
    setLoading(true);
    try {
      const history = messages.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:context,
          messages:[...history,{role:"user",content:userMsg}]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==="text")?.text || "Sorry, I couldn't process that.";
      setMessages(prev=>[...prev,{role:"assistant",text}]);
    } catch(e){
      setMessages(prev=>[...prev,{role:"assistant",text:"Error reaching AI. Please try again."}]);
    }
    setLoading(false);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:420}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,marginBottom:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{
              maxWidth:"80%",padding:"10px 14px",borderRadius:10,fontSize:13,lineHeight:1.6,
              background:m.role==="user"?C.amberDim:C.surface,
              color:m.role==="user"?C.amber:C.text,
              border:`1px solid ${m.role==="user"?C.amber+"40":C.border}`
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:6,padding:"10px 14px"}}>
            {[0,1,2].map(i=><span key={i} style={{width:8,height:8,borderRadius:"50%",background:C.amber,animation:`bounce 0.8s ${i*0.15}s infinite`}}/>)}
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <input
          value={prompt} onChange={e=>setPrompt(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about your fleet, profits, compliance..."
          style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,outline:"none"}}
        />
        <button onClick={send} disabled={loading||!prompt.trim()}
          style={{background:C.amber,color:"#000",border:"none",borderRadius:8,padding:"10px 18px",cursor:"pointer",fontWeight:700,fontSize:13,opacity:loading||!prompt.trim()?0.5:1}}>
          Send
        </button>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ── VIEWS ─────────────────────────────────────────────────────────────────────

function Dashboard(){
  const totalRevenue = TRIPS.reduce((s,t)=>s+t.freight+t.otherIncome,0);
  const totalExpense = TRIPS.reduce((s,t)=>s+t.totalExp,0);
  const totalProfit  = TRIPS.reduce((s,t)=>s+t.profit,0);
  const avgProfitKM  = (totalProfit / TRIPS.reduce((s,t)=>s+t.dist,0)).toFixed(2);
  const pendingInv   = INVOICES.filter(i=>i.status==="Unpaid").reduce((s,i)=>s+i.total,0);
  const expiredDocs  = COMPLIANCE.filter(c=>daysUntil(c.expiry)<0).length;
  const expiringDocs = COMPLIANCE.filter(c=>{ const d=daysUntil(c.expiry); return d>=0&&d<60; }).length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
        <KPI label="Total Trips"         value={TRIPS.length}           sub="This month"           accent={C.blue}/>
        <KPI label="Freight Revenue"     value={`₹${fmt(totalRevenue)}`} sub="Gross"               accent={C.amber}/>
        <KPI label="Total Expenses"      value={`₹${fmt(totalExpense)}`} sub="Operating costs"     accent={C.red}/>
        <KPI label="Net Profit"          value={`₹${fmt(totalProfit)}`}  sub={`₹${avgProfitKM}/km`} accent={C.green}/>
        <KPI label="Pending Invoices"    value={`₹${fmt(pendingInv)}`}   sub={`${INVOICES.filter(i=>i.status==="Unpaid").length} invoices`} accent="#f97316"/>
        <KPI label="Compliance Alerts"  value={expiredDocs+expiringDocs} sub={`${expiredDocs} expired`} accent={expiredDocs>0?C.red:"#facc15"}/>
      </div>

      {/* Recent Trips */}
      <div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.border}`}}>
        <SectionHead icon="🗺️" title="Recent Trips" badge={`${TRIPS.length} trips`}/>
        <Table
          cols={[
            {key:"id",    label:"Trip ID"},
            {key:"date",  label:"Date"},
            {key:"route", label:"Route"},
            {key:"vehicle",label:"Vehicle"},
            {key:"load",  label:"Load (T)", render:r=>`${r.load}T`},
            {key:"freight",label:"Revenue",  render:r=>`₹${fmt(r.freight)}`},
            {key:"profit", label:"Profit",   render:r=><span style={{color:r.profit>0?C.green:C.red}}>₹{fmt(r.profit)}</span>},
          ]}
          rows={TRIPS}
        />
      </div>

      {/* Compliance Alerts */}
      <div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.border}`}}>
        <SectionHead icon="⚠️" title="Compliance Alerts" badge={`${expiredDocs} urgent`}/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {COMPLIANCE.sort((a,b)=>new Date(a.expiry)-new Date(b.expiry)).map((c,i)=>{
            const d = daysUntil(c.expiry);
            const col = complianceColor(c.expiry);
            if(d>90) return null;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:C.surface,borderRadius:8,border:`1px solid ${col}30`}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:col,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13}}><b>{c.id}</b> — {c.doc}</span>
                <span style={{fontSize:12,color:col,fontFamily:"'DM Mono',monospace"}}>{d<0?`${Math.abs(d)}d overdue`:`${d}d left`}</span>
                <Tag label={d<0?"EXPIRED":d<30?"URGENT":d<60?"WARNING":"OK"} color={d<0?"red":d<30?"red":d<60?"amber":"green"}/>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.amber}30`}}>
        <SectionHead icon="🤖" title="AI Assistant" badge="Powered by Claude"/>
        <AIInsights/>
      </div>
    </div>
  );
}

function FleetView(){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {FLEET.map(v=>(
        <div key={v.id} style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:16}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>🚚</span>
                <div>
                  <div style={{fontWeight:700,fontSize:16,color:C.text,fontFamily:"'Space Grotesk',sans-serif"}}>{v.make} {v.model} <span style={{color:C.muted,fontSize:13,fontWeight:400}}>({v.year})</span></div>
                  <div style={{fontSize:12,color:C.amber,fontFamily:"'DM Mono',monospace"}}>{v.reg} · {v.id}</div>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Tag label={v.status}    color="green"/>
              <Tag label={v.ownership} color="blue"/>
              <Tag label={v.type}      color="amber"/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
            {[
              ["Capacity",`${v.capacity}T`],
              ["Odometer",`${fmt(v.odometer)} km`],
              ["Fuel Type",v.fuel],
              ["Mileage",`${v.mileage} KMPL`],
              ["Insurance",v.insurance],
              ["Fitness",v.fitness],
              ["Permit",v.permit],
              ["RC Expiry",v.rc],
            ].map(([label,val],i)=>{
              const isDate = val.match(/^\d{4}-/);
              const col = isDate ? complianceColor(val) : C.text;
              return (
                <div key={i} style={{background:C.surface,borderRadius:8,padding:"8px 12px"}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:2,fontFamily:"'DM Mono',monospace",letterSpacing:"0.05em"}}>{label.toUpperCase()}</div>
                  <div style={{fontSize:13,color:col,fontWeight:500}}>{val}</div>
                </div>
              );
            })}
          </div>
          {v.notes && <div style={{marginTop:12,fontSize:12,color:C.muted,fontStyle:"italic"}}>📝 {v.notes}</div>}
        </div>
      ))}
    </div>
  );
}

function DriversView(){
  return (
    <div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.border}`}}>
      <SectionHead icon="👤" title="Driver Roster" badge={`${DRIVERS.length} drivers`}/>
      <Table
        cols={[
          {key:"id",    label:"ID"},
          {key:"name",  label:"Name"},
          {key:"phone", label:"Phone"},
          {key:"license",label:"License No"},
          {key:"expiry",label:"Expiry",render:r=><span style={{color:complianceColor(r.expiry),fontFamily:"'DM Mono',monospace"}}>{r.expiry}</span>},
          {key:"blood", label:"Blood Grp"},
          {key:"joining",label:"Joined"},
          {key:"status",label:"Status",render:r=><Tag label={r.status} color="green"/>},
        ]}
        rows={DRIVERS}
      />
    </div>
  );
}

function TripsView(){
  const [filter,setFilter] = useState("all");
  const filtered = filter==="profit" ? TRIPS.filter(t=>t.profit>0) : filter==="loss" ? TRIPS.filter(t=>t.profit<=0) : TRIPS;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",gap:8}}>
        {["all","profit","loss"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"6px 16px",borderRadius:8,border:`1px solid ${filter===f?C.amber:C.border}`,
            background:filter===f?C.amberDim:"transparent",color:filter===f?C.amber:C.muted,
            cursor:"pointer",fontSize:13,fontFamily:"'DM Mono',monospace"
          }}>{f==="all"?"All Trips":f==="profit"?"Profitable":"Loss-making"}</button>
        ))}
      </div>
      <div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.border}`}}>
        <SectionHead icon="📦" title="Trip Log" badge={`${filtered.length} records`}/>
        <Table
          cols={[
            {key:"id",      label:"Trip ID"},
            {key:"date",    label:"Date"},
            {key:"route",   label:"Route"},
            {key:"vehicle", label:"Vehicle"},
            {key:"driver",  label:"Driver"},
            {key:"load",    label:"Load", render:r=>`${r.load}T`},
            {key:"dist",    label:"Dist", render:r=>`${r.dist}km`},
            {key:"freight", label:"Freight",  render:r=>`₹${fmt(r.freight)}`},
            {key:"totalExp",label:"Expenses", render:r=>`₹${fmt(r.totalExp)}`},
            {key:"profit",  label:"Profit",   render:r=><b style={{color:r.profit>0?C.green:C.red}}>₹{fmt(r.profit)}</b>},
          ]}
          rows={filtered}
        />
      </div>
    </div>
  );
}

function FuelView(){
  const total = FUEL.reduce((s,f)=>s+f.cost,0);
  const totalL = FUEL.reduce((s,f)=>s+f.litres,0);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
        <KPI label="Total Fuel Cost"  value={`₹${fmt(total)}`}    sub="This period" accent={C.amber}/>
        <KPI label="Total Litres"     value={`${totalL}L`}          sub="Consumed"   accent={C.blue}/>
        <KPI label="Avg Rate/Litre"   value={`₹${(total/totalL).toFixed(0)}`} sub="per litre" accent={C.muted}/>
        <KPI label="Vehicles Filled"  value={FUEL.length}            sub="Fill-ups"  accent={C.green}/>
      </div>
      <div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.border}`}}>
        <SectionHead icon="⛽" title="Fuel Log"/>
        <Table
          cols={[
            {key:"date",    label:"Date"},
            {key:"vehicle", label:"Vehicle"},
            {key:"odo",     label:"Odometer",  render:r=>`${fmt(r.odo)} km`},
            {key:"litres",  label:"Litres",    render:r=>`${r.litres}L`},
            {key:"rate",    label:"Rate/L",    render:r=>`₹${r.rate}`},
            {key:"cost",    label:"Cost",      render:r=>`₹${fmt(r.cost)}`},
            {key:"station", label:"Station"},
            {key:"inv",     label:"Invoice"},
          ]}
          rows={FUEL}
        />
      </div>
      <div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.border}`}}>
        <SectionHead icon="🔧" title="Maintenance Log"/>
        <Table
          cols={[
            {key:"date",    label:"Date"},
            {key:"vehicle", label:"Vehicle"},
            {key:"cat",     label:"Category"},
            {key:"desc",    label:"Description"},
            {key:"parts",   label:"Parts",  render:r=>`₹${fmt(r.parts)}`},
            {key:"labour",  label:"Labour", render:r=>`₹${fmt(r.labour)}`},
            {key:"total",   label:"Total",  render:r=>`₹${fmt(r.total)}`},
            {key:"nextDue", label:"Next Due"},
          ]}
          rows={MAINTENANCE}
        />
      </div>
    </div>
  );
}

function InvoicesView(){
  const total   = INVOICES.reduce((s,i)=>s+i.total,0);
  const paid    = INVOICES.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.total,0);
  const pending = total - paid;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
        <KPI label="Total Billed"  value={`₹${fmt(total)}`}   sub="incl. GST"  accent={C.amber}/>
        <KPI label="Collected"     value={`₹${fmt(paid)}`}    sub="Paid"       accent={C.green}/>
        <KPI label="Pending"       value={`₹${fmt(pending)}`} sub="Outstanding" accent={C.red}/>
        <KPI label="Collection %" value={`${((paid/total)*100).toFixed(0)}%`} sub="rate" accent={C.blue}/>
      </div>
      <div style={{background:C.card,borderRadius:12,padding:20,border:`1px solid ${C.border}`}}>
        <SectionHead icon="🧾" title="Invoice Register" badge={`${INVOICES.filter(i=>i.status==="Unpaid").length} unpaid`}/>
        <Table
          cols={[
            {key:"no",      label:"Invoice No"},
            {key:"date",    label:"Date"},
            {key:"customer",label:"Customer"},
            {key:"trip",    label:"Trip ID"},
            {key:"sub",     label:"Sub Total", render:r=>`₹${fmt(r.sub)}`},
            {key:"gstAmt",  label:"GST",       render:r=>`₹${fmt(r.gstAmt)}`},
            {key:"total",   label:"Total",     render:r=>`₹${fmt(r.total)}`},
            {key:"due",     label:"Due Date"},
            {key:"status",  label:"Status",    render:r=><Tag label={r.status} color={r.status==="Paid"?"green":"red"}/>},
          ]}
          rows={INVOICES}
        />
      </div>
    </div>
  );
}

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
const NAV = [
  {id:"dashboard", icon:"📊", label:"Dashboard"},
  {id:"fleet",     icon:"🚚", label:"Fleet"},
  {id:"drivers",   icon:"👤", label:"Drivers"},
  {id:"trips",     icon:"📦", label:"Trips"},
  {id:"fuel",      icon:"⛽", label:"Fuel & Maint."},
  {id:"invoices",  icon:"🧾", label:"Invoices"},
];

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const [active,setActive] = useState("dashboard");
  const [sideOpen,setSideOpen] = useState(true);

  const views = {dashboard:<Dashboard/>, fleet:<FleetView/>, drivers:<DriversView/>, trips:<TripsView/>, fuel:<FuelView/>, invoices:<InvoicesView/>};

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',system-ui,sans-serif",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>

      {/* Sidebar */}
      <div style={{width:sideOpen?220:64,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",transition:"width 0.2s",flexShrink:0,overflow:"hidden"}}>
        {/* Logo */}
        <div style={{padding:"20px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setSideOpen(o=>!o)}>
          <div style={{width:36,height:36,borderRadius:8,background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🚛</div>
          {sideOpen && <div>
            <div style={{fontWeight:700,fontSize:16,color:C.text,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>My Truck</div>
            <div style={{fontSize:10,color:C.amber,fontFamily:"'DM Mono',monospace",marginTop:2}}>YOUR OWN TRANSPORT MANAGER</div>
          </div>}
        </div>
        {/* Nav */}
        <nav style={{flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setActive(n.id)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 10px",borderRadius:8,
              background:active===n.id?`${C.amber}18`:"transparent",
              border:`1px solid ${active===n.id?C.amber+"50":"transparent"}`,
              cursor:"pointer",width:"100%",textAlign:"left",color:active===n.id?C.amber:C.muted
            }}>
              <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
              {sideOpen && <span style={{fontSize:13,fontWeight:active===n.id?600:400,whiteSpace:"nowrap"}}>{n.label}</span>}
            </button>
          ))}
        </nav>
        {/* Footer */}
        {sideOpen && <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,fontSize:11,color:C.muted}}>
          <div>March 2026</div>
          <div style={{color:C.green,marginTop:2}}>● All systems operational</div>
        </div>}
      </div>

      {/* Main */}
      <div style={{flex:1,overflow:"auto",padding:24}}>
        {/* Top bar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div>
            <h1 style={{margin:0,fontSize:22,fontWeight:700,color:C.text,fontFamily:"'Space Grotesk',sans-serif"}}>{NAV.find(n=>n.id===active)?.label}</h1>
            <p style={{margin:0,fontSize:13,color:C.muted,marginTop:2}}>16 March 2026 — Transport Business Overview</p>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:`${C.red}20`,border:`1px solid ${C.red}50`,color:C.red,padding:"6px 12px",borderRadius:8,fontSize:12,fontFamily:"'DM Mono',monospace"}}>
              ⚠️ 1 doc expired
            </div>
            <div style={{width:36,height:36,borderRadius:"50%",background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#000"}}>A</div>
          </div>
        </div>
        {views[active]}
      </div>
    </div>
  );
}
