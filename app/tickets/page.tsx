"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketsPage() {
  const router = useRouter();
  const [name,setName] = useState("");
  const [subject,setSubject] = useState("");
  const [details,setDetails] = useState("");
  const [busy,setBusy] = useState(false);
  const [sent,setSent] = useState(false);
  const [message,setMessage] = useState("");

  async function submit(e:FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/tickets", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name,subject,details}) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(data.error || "Could not create ticket.");
    setSent(true); setName(""); setSubject(""); setDetails(""); setMessage("Your ticket was sent privately to the admin.");
  }

  return <main className="form-shell"><section className="form-card">
    <div className="form-top"><div><p className="chat-kicker">Private support</p><h1>Make a Ticket</h1></div><button className="chat-back" onClick={()=>router.push("/")}>Back</button></div>
    <p className="subtitle">Tell the admin what has gone wrong. Your ticket will not be shown publicly.</p>
    <form className="suggestion-form" onSubmit={submit}>
      <div className="field"><label htmlFor="ticket-name">Your name</label><input id="ticket-name" value={name} onChange={e=>setName(e.target.value)} maxLength={50} required /></div>
      <div className="field"><label htmlFor="ticket-subject">What is the problem?</label><input id="ticket-subject" value={subject} onChange={e=>setSubject(e.target.value)} maxLength={100} required /></div>
      <div className="field"><label htmlFor="ticket-details">Explain what happened</label><textarea id="ticket-details" value={details} onChange={e=>setDetails(e.target.value)} maxLength={1500} required /></div>
      {message&&<p className={sent?"success":"error"}>{message}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy?"Sending...":"Send ticket"}</button>
    </form>
  </section></main>;
}
