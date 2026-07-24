"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Announcement = { id:number; title:string; message:string; created_at:string };

export default function AnnouncementsPage() {
  const router = useRouter();
  const [items,setItems] = useState<Announcement[]>([]);
  const [loading,setLoading] = useState(true);

  async function load() {
    const response = await fetch("/api/announcements", { cache:"no-store" });
    const data = await response.json();
    setItems(data.announcements || []);
    setLoading(false);
  }

  useEffect(()=>{ load(); const timer = window.setInterval(load, 10000); return ()=>window.clearInterval(timer); },[]);

  return <main className="admin-shell"><div className="admin-wrap">
    <div className="admin-top"><div><p className="subtitle">Official updates</p><h1>Announcements</h1></div><button className="btn btn-secondary" style={{width:"auto"}} onClick={()=>router.push("/")}>Back</button></div>
    <section className="admin-panel">
      {loading ? <div className="empty">Loading announcements...</div> : items.length===0 ? <div className="empty">No announcements have been posted yet.</div> : items.map(item=><article className="announcement-card" key={item.id}><div className="announcement-head"><strong>{item.title}</strong><small>{new Date(item.created_at).toLocaleString()}</small></div><p>{item.message}</p></article>)}
    </section>
  </div></main>;
}
