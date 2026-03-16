import { useState, useRef, useEffect } from "react";

const C = {
  bg:"#0d1117", surface:"#161b22", card:"#1c2430",
  amber:"#f0a500", amberDim:"#3a2a0a",
  green:"#3fb950", red:"#f85149", blue:"#58a6ff",
  muted:"#8b949e", border:"#30363d", text:"#e6edf3",
};

const fmt = n => new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(n);
const today = new Date("2026-03-16");
const daysUntil = d => Math.round((new Date(d) - today) / 86400000);
const complianceColor = expiry => {
  const d = daysUntil(expiry);
  if(d < 0)  return C.red;
  if(d < 30) return "#f97316";
  if(d < 60) return "#facc15";
  return C.green;
};
const uid = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}`;

// \u2500\u2500 UI Atoms \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function KPI({label,value,sub,accent}){
  return (
    <div style={{background:C.card,borderRadius:12,padding:"18px 20px",border:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:5}}>
      <span style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",fontFamily:"'DM Mono',monospace"}}>{label}</span>
      <span style={{fontSize:24,fontWeight:700,color:accent||C.text,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>{value}</span>
      {sub && <span style={{fontSize:12,color:C.muted}}>{sub}</span>}
    </div>
  );
}

function SectionHead({icon,title,badge,onAdd}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap"}}>
      <span style={{fontSize:20}}>{icon}</span>
      <h2 style={{margin:0,fontSize:16,fontWeight:700,color:C.text,fontFamily:"'Space Grotesk',sans-serif"}}>{title}</h2>
      {badge && <span style={{fontSize:11,background:C.amberDim,color:C.amber,padding:"2px 8px",borderRadius:20,fontFamily:"'DM Mono',monospace"}}>{badge}</span>}
      {onAdd && (
        <button onClick={onAdd} style={{marginLeft:"auto",background:C.amber,color:"#000",border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:17,lineHeight:1}}>+</span> Add New
        </button>
      )}
    </div>
  );
}

function Tag({label,color}){
  const map = {green:["#1a3a2a",C.green],red:["#3a1a1a",C.red],amber:["#3a2a0a",C.amber],blue:["#1a2a3a",C.blue]};
  const [bg,fg] = map[color]||map.blue;
  return <span style={{fontSize:11,background:bg,color:fg,padding:"2px 8px",borderRadius:6,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>{label}</span>;
}

function Table({cols,rows}){
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,color:C.text}}>
        <thead>
          <tr>{cols.map(c=><th key={c.key} style={{padding:"8px 12px",textAlign:"left",color:C.muted,fontWeight:500,borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace",fontSize:11}}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${C.border}20`}}>
              {cols.map(c=><td key={c.key} style={{padding:"10px 12px",whiteSpace:"nowrap"}}>{c.render?c.render(r):r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length===0 && <div style={{textAlign:"center",padding:32,color:C.muted,fontSize:14}}>No records yet \u2014 tap <b style={{color:C.amber}}>+ Add New</b> to get started.</div>}
    </div>
  );
}

function Modal({title,onClose,children}){
  return (
    <div style={{position:"fixed",inset:0,background:"#000b",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:24,width:"100%",maxWidth:500,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <h3 style={{margin:0,fontSize:17,fontWeight:700,color:C.text,fontFamily:"'Space Grotesk',sans-serif"}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:24,cursor:"pointer",lineHeight:1,padding:"0 4px"}}>\u00d7</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const iStyle = {width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"};
const lStyle = {fontSize:11,color:C.muted,display:"block",marginBottom:4,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.05em"};

function F({label,children}){ return <div style={{marginBottom:12}}><label style={lStyle}>{label}</label>{children}</div>; }
function I({label,...p}){ return <F label={label}><input style={iStyle} {...p}/></F>; }
function S({label,opts,...p}){
  return <F label={label}><select style={{...iStyle,cursor:"pointer"}} {...p}><option value="">Select\u2026</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select></F>;
}
function Row2({children}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{children}</div>; }
function SaveBtn({label="Save Record"}){
  return <button type="submit" style={{width:"100%",background:C.amber,color:"#000",border:"none",borderRadius:8,padding:11,cursor:"pointer",fontWeight:700,fontSize:14,marginTop:8}}>{label}</button>;
}

// \u2500\u2500 FORMS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function AddVehicleForm({onSave}){
  const [f,setF] = useState({reg:"",make:"",model:"",year:"",type:"Mini Truck",capacity:"",odometer:"",ownership:"Owned",rc:"",fitness:"",insurance:"",permit:"",fuel:"Diesel",mileage:"",status:"Active",notes:""});
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  function submit(e){ e.preventDefault(); onSave({...f,id:uid("VH"),year:+f.year,capacity:+f.capacity,odometer:+f.odometer,mileage:+f.mileage}); }
  return (
    <form onSubmit={submit}>
      <Row2><I label="Registration No" value={f.reg} onChange={up("reg")} placeholder="KA01AB1234" required/><I label="Make" value={f.make} onChange={up("make")} placeholder="Tata" required/></Row2>
      <Row2><I label="Model" value={f.model} onChange={up("model")} placeholder="407" required/><I label="Year" type="number" value={f.year} onChange={up("year")} placeholder="2023" required/></Row2>
      <Row2><S label="Vehicle Type" opts={["Mini Truck","Truck","Pickup","Trailer","Tanker"]} value={f.type} onChange={up("type")}/><I label="Capacity (Tons)" type="number" value={f.capacity} onChange={up("capacity")} placeholder="2.5" required/></Row2>
      <Row2><I label="Odometer (KM)" type="number" value={f.odometer} onChange={up("odometer")} placeholder="50000"/><S label="Ownership" opts={["Owned","Leased","Hired"]} value={f.ownership} onChange={up("ownership")}/></Row2>
      <Row2><S label="Fuel Type" opts={["Diesel","Petrol","CNG","EV"]} value={f.fuel} onChange={up("fuel")}/><I label="Avg Mileage (KMPL)" type="number" value={f.mileage} onChange={up("mileage")} placeholder="14.5"/></Row2>
      <Row2><I label="RC Expiry" type="date" value={f.rc} onChange={up("rc")}/><I label="Fitness Expiry" type="date" value={f.fitness} onChange={up("fitness")}/></Row2>
      <Row2><I label="Insurance Expiry" type="date" value={f.insurance} onChange={up("insurance")}/><I label="Permit Expiry" type="date" value={f.permit} onChange={up("permit")}/></Row2>
      <S label="Status" opts={["Active","Inactive","In Repair"]} value={f.status} onChange={up("status")}/>
      <F label="Notes"><textarea style={{...iStyle,resize:"vertical",minHeight:56}} value={f.notes} onChange={up("notes")} placeholder="Any notes\u2026"/></F>
      <SaveBtn label="Add Vehicle"/>
    </form>
  );
}

function AddDriverForm({onSave}){
  const [f,setF] = useState({name:"",phone:"",license:"",expiry:"",blood:"",joining:"",status:"Active"});
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  function submit(e){ e.preventDefault(); onSave({...f,id:uid("DR")}); }
  return (
    <form onSubmit={submit}>
      <I label="Full Name" value={f.name} onChange={up("name")} placeholder="Ravi Kumar" required/>
      <Row2><I label="Phone" value={f.phone} onChange={up("phone")} placeholder="+91-9876543210" required/><S label="Blood Group" opts={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} value={f.blood} onChange={up("blood")}/></Row2>
      <Row2><I label="License No" value={f.license} onChange={up("license")} placeholder="KA0120230001234" required/><I label="License Expiry" type="date" value={f.expiry} onChange={up("expiry")} required/></Row2>
      <Row2><I label="Joining Date" type="date" value={f.joining} onChange={up("joining")}/><S label="Status" opts={["Active","Inactive","On Leave"]} value={f.status} onChange={up("status")}/></Row2>
      <SaveBtn label="Add Driver"/>
    </form>
  );
}

function AddTripForm({fleet,drivers,onSave}){
  const [f,setF] = useState({date:"",vehicle:"",driver:"",customer:"",route:"",load:"",dist:"",rate:"",toll:"",otherIncome:"",fuelCost:"",driverExp:"",maint:"",otherExp:""});
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  function submit(e){
    e.preventDefault();
    const freight = (+f.load)*(+f.rate);
    const totalExp = (+f.fuelCost)+(+f.driverExp)+(+f.maint)+(+f.otherExp)+(+f.toll);
    const profit = freight+(+f.otherIncome)-totalExp;
    onSave({...f,id:uid("TRIP"),freight,totalExp,profit,load:+f.load,dist:+f.dist,rate:+f.rate,toll:+f.toll,otherIncome:+f.otherIncome,fuelCost:+f.fuelCost,driverExp:+f.driverExp,maint:+f.maint,otherExp:+f.otherExp});
  }
  return (
    <form onSubmit={submit}>
      <Row2><I label="Date" type="date" value={f.date} onChange={up("date")} required/><I label="Customer" value={f.customer} onChange={up("customer")} placeholder="ABC Mfg" required/></Row2>
      <Row2>
        <S label="Vehicle" opts={fleet.map(v=>v.id)} value={f.vehicle} onChange={up("vehicle")}/>
        <S label="Driver"  opts={drivers.map(d=>d.id)} value={f.driver} onChange={up("driver")}/>
      </Row2>
      <I label="Route" value={f.route} onChange={up("route")} placeholder="Bengaluru\u2192Mysuru" required/>
      <Row2><I label="Load (Tons)" type="number" value={f.load} onChange={up("load")} placeholder="2.0" required/><I label="Distance (KM)" type="number" value={f.dist} onChange={up("dist")} placeholder="145" required/></Row2>
      <Row2><I label="Rate per Ton (\u20b9)" type="number" value={f.rate} onChange={up("rate")} placeholder="900" required/><I label="Toll (\u20b9)" type="number" value={f.toll} onChange={up("toll")} placeholder="350"/></Row2>
      <p style={{margin:"4px 0 10px",fontSize:12,color:C.muted,fontFamily:"'DM Mono',monospace"}}>\u2014 EXPENSES \u2014</p>
      <Row2><I label="Fuel Cost (\u20b9)" type="number" value={f.fuelCost} onChange={up("fuelCost")} placeholder="1200"/><I label="Driver Expense (\u20b9)" type="number" value={f.driverExp} onChange={up("driverExp")} placeholder="500"/></Row2>
      <Row2><I label="Maintenance (\u20b9)" type="number" value={f.maint} onChange={up("maint")} placeholder="0"/><I label="Other Expenses (\u20b9)" type="number" value={f.otherExp} onChange={up("otherExp")} placeholder="100"/></Row2>
      <SaveBtn label="Add Trip"/>
    </form>
  );
}

function AddFuelForm({fleet,onSave}){
  const [f,setF] = useState({date:"",vehicle:"",odo:"",litres:"",rate:"",station:"",inv:""});
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  function submit(e){ e.preventDefault(); onSave({...f,odo:+f.odo,litres:+f.litres,rate:+f.rate,cost:(+f.litres)*(+f.rate)}); }
  return (
    <form onSubmit={submit}>
      <Row2><I label="Date" type="date" value={f.date} onChange={up("date")} required/><S label="Vehicle" opts={fleet.map(v=>v.id)} value={f.vehicle} onChange={up("vehicle")}/></Row2>
      <Row2><I label="Odometer (KM)" type="number" value={f.odo} onChange={up("odo")} placeholder="145500"/><I label="Litres Filled" type="number" value={f.litres} onChange={up("litres")} placeholder="40" required/></Row2>
      <Row2><I label="Rate per Litre (\u20b9)" type="number" value={f.rate} onChange={up("rate")} placeholder="105" required/><I label="Station Name" value={f.station} onChange={up("station")} placeholder="HP Fuel Station"/></Row2>
      <I label="Invoice No" value={f.inv} onChange={up("inv")} placeholder="INV-001"/>
      <SaveBtn label="Add Fuel Entry"/>
    </form>
  );
}

function AddMaintForm({fleet,onSave}){
  const [f,setF] = useState({date:"",vehicle:"",odo:"",vendor:"",cat:"Servicing",desc:"",parts:"",labour:"",nextDue:""});
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  function submit(e){ e.preventDefault(); onSave({...f,odo:+f.odo,parts:+f.parts,labour:+f.labour,total:(+f.parts)+(+f.labour)}); }
  return (
    <form onSubmit={submit}>
      <Row2><I label="Date" type="date" value={f.date} onChange={up("date")} required/><S label="Vehicle" opts={fleet.map(v=>v.id)} value={f.vehicle} onChange={up("vehicle")}/></Row2>
      <Row2><I label="Odometer (KM)" type="number" value={f.odo} onChange={up("odo")} placeholder="145600"/><S label="Category" opts={["Servicing","Tyres","Brakes","Engine","Electrical","Body","Other"]} value={f.cat} onChange={up("cat")}/></Row2>
      <I label="Vendor / Workshop" value={f.vendor} onChange={up("vendor")} placeholder="Tata Service Centre"/>
      <F label="Description"><textarea style={{...iStyle,resize:"vertical",minHeight:56}} value={f.desc} onChange={up("desc")} placeholder="Oil & filter change\u2026" required/></F>
      <Row2><I label="Parts Cost (\u20b9)" type="number" value={f.parts} onChange={up("parts")} placeholder="800"/><I label="Labour Cost (\u20b9)" type="number" value={f.labour} onChange={up("labour")} placeholder="500"/></Row2>
      <I label="Next Due Date" type="date" value={f.nextDue} onChange={up("nextDue")}/>
      <SaveBtn label="Add Maintenance Record"/>
    </form>
  );
}

function AddInvoiceForm({trips,onSave}){
  const [f,setF] = useState({date:"",customer:"",trip:"",desc:"",qty:"",rate:"",gst:"5",due:"",status:"Unpaid"});
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  function submit(e){
    e.preventDefault();
    const sub = (+f.qty)*(+f.rate);
    const gstAmt = sub*(+f.gst)/100;
    onSave({...f,no:uid("INV"),qty:+f.qty,rate:+f.rate,sub,gstAmt,total:sub+gstAmt,gst:+f.gst});
  }
  return (
    <form onSubmit={submit}>
      <Row2><I label="Invoice Date" type="date" value={f.date} onChange={up("date")} required/><I label="Customer Name" value={f.customer} onChange={up("customer")} placeholder="ABC Mfg" required/></Row2>
      <S label="Link to Trip" opts={trips.map(t=>t.id)} value={f.trip} onChange={up("trip")}/>
      <F label="Description"><textarea style={{...iStyle,resize:"vertical",minHeight:56}} value={f.desc} onChange={up("desc")} placeholder="Freight \u2013 Bengaluru to Mysuru" required/></F>
      <Row2><I label="Qty (Tons)" type="number" value={f.qty} onChange={up("qty")} placeholder="1.5" required/><I label="Rate per Ton (\u20b9)" type="number" value={f.rate} onChange={up("rate")} placeholder="900" required/></Row2>
      <Row2><I label="GST %" type="number" value={f.gst} onChange={up("gst")} placeholder="5"/><I label="Due Date" type="date" value={f.due} onChange={up("due")}/></Row2>
      <S label="Status" opts={["Unpaid","Paid","Partially Paid"]} value={f.status} onChange={up("status")}/>
      <SaveBtn label="Create Invoice"/>
    </form>
  );
}

function AddComplianceForm({fleet,drivers,onSave}){
  const [f,setF] = useState({entity:"Vehicle",id:"",doc:"",no:"",issue:"",expiry:"",days:"30",status:"Active"});
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  const idOpts = f.entity==="Vehicle" ? fleet.map(v=>v.id) : drivers.map(d=>d.id);
  function submit(e){ e.preventDefault(); onSave({...f,days:+f.days}); }
  return (
    <form onSubmit={submit}>
      <Row2><S label="Entity Type" opts={["Vehicle","Driver"]} value={f.entity} onChange={up("entity")}/><S label="ID" opts={idOpts} value={f.id} onChange={up("id")}/></Row2>
      <Row2><S label="Document Type" opts={["Insurance","Fitness","Permit","RC","License","PUC","Other"]} value={f.doc} onChange={up("doc")}/><I label="Document No" value={f.no} onChange={up("no")} placeholder="INS2026001" required/></Row2>
      <Row2><I label="Issue Date" type="date" value={f.issue} onChange={up("issue")}/><I label="Expiry Date" type="date" value={f.expiry} onChange={up("expiry")} required/></Row2>
      <Row2><I label="Reminder Days Before" type="number" value={f.days} onChange={up("days")} placeholder="30"/><S label="Status" opts={["Active","Expired","Pending"]} value={f.status} onChange={up("status")}/></Row2>
      <SaveBtn label="Add Compliance Document"/>
    </form>
  );
}

// \u2500\u2500 AI Chat \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function AIInsights({fleet,trips,invoices,compliance}){
  const [prompt,setPrompt] = useState("");
  const [messages,setMessages] = useState([{role:"assistant",text:"Hello! I'm your My Truck AI. Ask me anything about your fleet, trips, invoices, or compliance."}]);
  const [loading,setLoading] = useState(false);
  const endRef = useRef();
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  async function send(){
    if(!prompt.trim()||loading) return;
    const msg = prompt.trim(); setPrompt("");
    setMessages(p=>[...p,{role:"user",text:msg}]);
    setLoading(true);
    const ctx = `You are My Truck AI. Fleet: ${fleet.length} vehicles. Trips: ${trips.length}, Revenue: \u20b9${fmt(trips.reduce((s,t)=>s+t.freight,0))}, Profit: \u20b9${fmt(trips.reduce((s,t)=>s+t.profit,0))}. Pending invoices: ${invoices.filter(i=>i.status==="Unpaid").length}. Expired docs: ${compliance.filter(c=>daysUntil(c.expiry)<0).length}. Be concise, use \u20b9.`;
    try {
      const history = messages.map(m=>({role:m.role,content:m.text}));
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:ctx,messages:[...history,{role:"user",content:msg}]})});
      const data = await res.json();
      setMessages(p=>[...p,{role:"assistant",text:data.content?.find(b=>b.type==="text")?.text||"Error."}]);
    } catch { setMessages(p=>[...p,{role:"assistant",text:"Network error. Please try again."}]); }
    setLoading(false);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:360}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"82%",padding:"10px 
