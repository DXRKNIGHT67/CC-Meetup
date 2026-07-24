"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuggestionsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function submitSuggestion(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, suggestion }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(data.error || "Could not send suggestion.");
    setSent(true);
    setSuggestion("");
    setMessage("Suggestion sent to the admin.");
  }

  return <main className="subpage-shell">
    <section className="subpage-card">
      <div className="subpage-top">
        <button className="btn btn-secondary back-btn" onClick={() => router.push("/")}>← Back</button>
        <div className="brand compact-brand"><img src="/logo.svg" alt="CC Meetup logo" /><div className="brand-copy"><strong>CC</strong><small>Meetup</small></div></div>
      </div>
      <p className="subtitle">Send an idea directly to the admin. Suggestions are private and are not shown publicly.</p>
      <h1>Suggestions</h1>
      <form className="suggestion-form" onSubmit={submitSuggestion}>
        <div className="field"><label htmlFor="suggestion-name">Your name</label><input id="suggestion-name" value={name} onChange={e=>setName(e.target.value)} maxLength={50} required /></div>
        <div className="field"><label htmlFor="suggestion-text">Your suggestion</label><textarea id="suggestion-text" value={suggestion} onChange={e=>setSuggestion(e.target.value)} maxLength={1000} required /></div>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Sending..." : "Send suggestion"}</button>
        {message && <p className={sent ? "success" : "error"}>{message}</p>}
      </form>
    </section>
  </main>;
}
