"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Registration = { id:number; name:string; created_at:string };

export default function AdminPage() {
  const router = useRouter();
  const [tab,setTab] = useState<"people"|"code">("people");
  const [registrations,setRegistrations] = useState<Registration[]>([]);
  const [code,setCode] = useState("");
  const [message,setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/registrations", { cache:"no-store" });
    if (response.status === 401) return router.replace("/");
    const data = await response.json();
    setRegistrations(data.registrations || []);
    const codeResponse = await fetch("/api/code", { cache:"no-store" });
    const codeData = await codeResponse.json();
    setCode(codeData.code || "");
  }
  useEffect(()=>{ load(); },[]);

  async function remove(id:number) {
    const response = await fetch("/api/admin/registrations", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id}) });
    if (response.ok) setRegistrations(items=>items.filter(item=>item.id!==id));
  }
  async function saveCode() {
    setMessage("");
    const response = await fetch("/api/admin/code", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({code}) });
    const data = await response.json();
    setMessage(response.ok ? "Code updated." : data.error || "Could not update code.");
  }
  async function logout() {
    await fetch("/api/admin/logout", { method:"POST" });
    router.replace("/");
  }

  return <main className="admin-shell"><div className="admin-wrap">
    <div className="admin-top"><div><p className="subtitle">Private dashboard</p><h1>CC Admin</h1></div><button className="btn btn-secondary" style={{width:"auto"}} onClick={logout}>Log out</button></div>
    <div className="tabs"><button className={`tab ${tab==="people"?"active":""}`} onClick={()=>setTab("people")}>Registered</button><button className={`tab ${tab==="code"?"active":""}`} onClick={()=>setTab("code")}>Code</button></div>
    {tab === "people" ? <section className="admin-panel"><div className="panel-head"><strong>Registered people</strong><span>{registrations.length}</span></div>{registrations.length===0?<div className="empty">Nobody has registered yet.</div>:registrations.map(person=><div className="name-row" key={person.id}><div className="name-meta"><strong>{person.name}</strong><small>{new Date(person.created_at).toLocaleString()}</small></div><button className="icon-delete" aria-label={`Remove ${person.name}`} onClick={()=>remove(person.id)}>×</button></div>)}</section>
    : <section className="admin-panel"><div className="panel-head"><strong>Public meetup code</strong></div><div className="code-editor"><div className="field"><label htmlFor="code">Code shown to everyone</label><input id="code" value={code} onChange={e=>setCode(e.target.value)} maxLength={80} /></div><button className="btn btn-primary" style={{maxWidth:220}} onClick={saveCode}>Save code</button>{message&&<p className={message==="Code updated."?"success":"error"} style={{marginTop:14}}>{message}</p>}</div></section>}
  </div></main>;
}
