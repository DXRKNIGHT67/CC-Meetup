"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Registration = { id:number; name:string; created_at:string };
type Announcement = { id:number; title:string; message:string; created_at:string };

export default function AdminPage() {
  const router = useRouter();
  const [tab,setTab] = useState<"people"|"code"|"announcements">("people");
  const [registrations,setRegistrations] = useState<Registration[]>([]);
  const [announcements,setAnnouncements] = useState<Announcement[]>([]);
  const [code,setCode] = useState("");
  const [title,setTitle] = useState("");
  const [announcement,setAnnouncement] = useState("");
  const [message,setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/registrations", { cache:"no-store" });
    if (response.status === 401) return router.replace("/");
    const data = await response.json();
    setRegistrations(data.registrations || []);
    const [codeResponse, announcementResponse] = await Promise.all([
      fetch("/api/code", { cache:"no-store" }),
      fetch("/api/admin/announcements", { cache:"no-store" })
    ]);
    const codeData = await codeResponse.json();
    const announcementData = await announcementResponse.json();
    setCode(codeData.code || "");
    setAnnouncements(announcementData.announcements || []);
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
  async function postAnnouncement(e:FormEvent) {
    e.preventDefault(); setMessage("");
    const response = await fetch("/api/admin/announcements", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({title,message:announcement}) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || "Could not post announcement.");
    setAnnouncements(items=>[data.announcement,...items]); setTitle(""); setAnnouncement(""); setMessage("Announcement posted.");
  }
  async function deleteAnnouncement(id:number) {
    const response = await fetch("/api/admin/announcements", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id}) });
    if (response.ok) setAnnouncements(items=>items.filter(item=>item.id!==id));
  }
  async function logout() { await fetch("/api/admin/logout", { method:"POST" }); router.replace("/"); }

  return <main className="admin-shell"><div className="admin-wrap">
    <div className="admin-top"><div><p className="subtitle">Private dashboard</p><h1>CC Admin</h1></div><button className="btn btn-secondary" style={{width:"auto"}} onClick={logout}>Log out</button></div>
    <div className="tabs"><button className={`tab ${tab==="people"?"active":""}`} onClick={()=>{setTab("people");setMessage("")}}>Registered</button><button className={`tab ${tab==="code"?"active":""}`} onClick={()=>{setTab("code");setMessage("")}}>Code</button><button className={`tab ${tab==="announcements"?"active":""}`} onClick={()=>{setTab("announcements");setMessage("")}}>Announcements</button></div>
    {tab === "people" ? <section className="admin-panel"><div className="panel-head"><strong>Registered people</strong><span>{registrations.length}</span></div>{registrations.length===0?<div className="empty">Nobody has registered yet.</div>:registrations.map(person=><div className="name-row" key={person.id}><div className="name-meta"><strong>{person.name}</strong><small>{new Date(person.created_at).toLocaleString()}</small></div><button className="icon-delete" aria-label={`Remove ${person.name}`} onClick={()=>remove(person.id)}>×</button></div>)}</section>
    : tab === "code" ? <section className="admin-panel"><div className="panel-head"><strong>Public meetup code</strong></div><div className="code-editor"><div className="field"><label htmlFor="code">Code shown to everyone</label><input id="code" value={code} onChange={e=>setCode(e.target.value)} maxLength={80} /></div><button className="btn btn-primary" style={{maxWidth:220}} onClick={saveCode}>Save code</button>{message&&<p className={message==="Code updated."?"success":"error"} style={{marginTop:14}}>{message}</p>}</div></section>
    : <section className="admin-panel"><div className="panel-head"><strong>Post an announcement</strong><span>{announcements.length}</span></div><form className="announcement-form" onSubmit={postAnnouncement}><div className="field"><label htmlFor="announcement-title">Title</label><input id="announcement-title" value={title} onChange={e=>setTitle(e.target.value)} maxLength={80} required /></div><div className="field"><label htmlFor="announcement-message">Message</label><textarea id="announcement-message" value={announcement} onChange={e=>setAnnouncement(e.target.value)} maxLength={1000} required /></div><button className="btn btn-primary" style={{maxWidth:220}}>Post announcement</button>{message&&<p className={message==="Announcement posted."?"success":"error"}>{message}</p>}</form><div className="announcement-list">{announcements.length===0?<div className="empty">No announcements posted yet.</div>:announcements.map(item=><article className="announcement-card admin-announcement" key={item.id}><div className="announcement-head"><div><strong>{item.title}</strong><small>{new Date(item.created_at).toLocaleString()}</small></div><button className="icon-delete" aria-label={`Delete ${item.title}`} onClick={()=>deleteAnnouncement(item.id)}>×</button></div><p>{item.message}</p></article>)}</div></section>}
  </div></main>;
}
