"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Modal = "register" | "code" | "login" | null;

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [publicCode, setPublicCode] = useState("No code has been posted yet");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [meetupTime, setMeetupTime] = useState(process.env.NEXT_PUBLIC_MEETUP_TIME || "Time to be announced");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1800);
    fetch("/api/time", { cache: "no-store" })
      .then(response => response.json())
      .then(data => { if (data.time) setMeetupTime(data.time); })
      .catch(() => {});
    return () => window.clearTimeout(timer);
  }, []);

  async function register(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMessage("");
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(data.error || "Registration failed.");
    setRegistered(true);
    setMessage("You are registered!");
  }

  async function openCode() {
    setModal("code"); setMessage("");
    const response = await fetch("/api/code", { cache: "no-store" });
    const data = await response.json();
    setPublicCode(data.code || "No code has been posted yet");
  }

  async function login(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(data.error || "Login failed.");
    router.push("/admin");
  }

  return <>
    <div className={`loading-screen ${loading ? "" : "hide"}`}>
      <div className="loading-inner">
        <img className="logo-mark" src="/logo.svg" alt="CC Meetup" />
        <div className="loader" />
      </div>
    </div>

    <main className="page">
      <aside className="creator-social creator-left" aria-label="DXRKN!GHT social links">
        <div className="creator-name">DXRKN!GHT</div>
        <a
          className="social-link"
          href="https://www.tiktok.com/@my.vrfs.journey?is_from_webapp=1&sender_device=pc"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open DXRKN!GHT TikTok"
        >
          <span className="social-icon" aria-hidden="true">♪</span>
          <span><small>Follow on</small><strong>TikTok</strong></span>
        </a>
        <a
          className="social-link"
          href="https://www.youtube.com/channel/UCEvzus3QRmBjRIbOQxiUHDA"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open DXRKN!GHT YouTube"
        >
          <span className="social-icon youtube-icon" aria-hidden="true">▶</span>
          <span><small>Subscribe on</small><strong>YouTube</strong></span>
        </a>
      </aside>

      <aside className="creator-social creator-right" aria-label="DELUXE social links">
        <div className="creator-name">DELUXE</div>
        <a
          className="social-link"
          href="https://www.tiktok.com/@deluxe_vrfs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open DELUXE TikTok"
        >
          <span className="social-icon" aria-hidden="true">♪</span>
          <span><small>Follow on</small><strong>TikTok</strong></span>
        </a>
        <a
          className="social-link"
          href="https://www.youtube.com/@deluxevrfs-h7h"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open DELUXE YouTube"
        >
          <span className="social-icon youtube-icon" aria-hidden="true">▶</span>
          <span><small>Subscribe on</small><strong>YouTube</strong></span>
        </a>
      </aside>

      <section className="card">
        <div className="brand">
          <img src="/logo.svg" alt="CC Meetup logo" />
          <div className="brand-copy"><strong>CC</strong><small>Meetup</small></div>
        </div>
        <div className="time-pill">◷ {meetupTime}</div>
        <h1>CC Meetup</h1>
        <p className="subtitle">Enter your name to register, then check the public code when it is posted.</p>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => { setModal("register"); setMessage(""); }}>
            {registered ? "Registered ✓" : "Register"}
          </button>
          <button className="btn btn-secondary" onClick={openCode}>Code</button>
          <button className="btn btn-secondary" onClick={() => router.push("/chat")}>Chat</button>
          <button className="btn btn-secondary" onClick={() => router.push("/announcements")}>Announcements</button>
          <button className="btn btn-secondary" onClick={() => router.push("/suggestions")}>Suggestions</button>
          <button className="btn btn-secondary" onClick={() => router.push("/tickets")}>Support Ticket</button>
        </div>
      </section>
      <button className="secret-admin" aria-label="Admin access" onClick={() => { setModal("login"); setMessage(""); }} />
    </main>

    {modal === "register" && <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
      <form className="modal" onSubmit={register} onMouseDown={e => e.stopPropagation()}>
        <h2>Register</h2><p className="subtitle">Your name will only be visible inside the admin area.</p>
        <div className="field"><label htmlFor="name">Your name</label><input id="name" value={name} onChange={e=>setName(e.target.value)} maxLength={50} required autoFocus /></div>
        {message && <p className={registered ? "success" : "error"}>{message}</p>}
        <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={()=>setModal(null)}>Close</button><button className="btn btn-primary" disabled={busy || registered}>{registered ? "Registered" : busy ? "Saving..." : "Register"}</button></div>
      </form>
    </div>}

    {modal === "code" && <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}><h2>Meetup Code</h2><p className="subtitle">This code is read-only and can only be changed by the admin.</p><div className="code-box">{publicCode}</div><div className="modal-actions"><button className="btn btn-secondary" onClick={()=>setModal(null)}>Close</button></div></div>
    </div>}

    {modal === "login" && <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
      <form className="modal" onSubmit={login} onMouseDown={e => e.stopPropagation()}>
        <h2>Admin Login</h2><p className="subtitle">Private access for managing registrations and the code.</p>
        <div className="field"><label htmlFor="username">Username</label><input id="username" value={username} onChange={e=>setUsername(e.target.value)} required autoFocus /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        {message && <p className="error">{message}</p>}
        <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-primary" disabled={busy}>{busy ? "Checking..." : "Login"}</button></div>
      </form>
    </div>}
  </>;
}
