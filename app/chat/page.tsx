"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ChatMessage = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

export default function ChatPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch("/api/chat", { cache: "no-store" });
      const data = await response.json();
      if (response.ok) setMessages(data.messages || []);
    } catch {
      // A later poll retries automatically.
    }
  }, []);

  useEffect(() => {
    const savedName = window.localStorage.getItem("cc-chat-name");
    if (savedName) setName(savedName);
    loadMessages();
    const interval = window.setInterval(loadMessages, 2000);
    return () => window.clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) return;

    setBusy(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setError(data.error || "Message could not be sent.");
      return;
    }

    window.localStorage.setItem("cc-chat-name", name.trim());
    setMessage("");
    await loadMessages();
  }

  return (
    <main className="chat-shell">
      <section className="chat-card">
        <header className="chat-top">
          <div>
            <span className="chat-kicker">CC Meetup</span>
            <h1>Chat</h1>
          </div>
          <button className="chat-back" onClick={() => router.push("/")}>← Back</button>
        </header>

        <p className="chat-note">Be respectful. Messages are visible to everyone using the chat.</p>

        <div className="chat-messages" ref={listRef} aria-live="polite">
          {messages.length === 0 ? (
            <div className="chat-empty">No messages yet. Start the conversation.</div>
          ) : messages.map(item => (
            <article className="chat-bubble" key={item.id}>
              <div className="chat-message-head">
                <strong>{item.name}</strong>
                <time>{new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
              </div>
              <p>{item.message}</p>
            </article>
          ))}
        </div>

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            aria-label="Chat display name"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={30}
            required
          />
          <div className="chat-compose">
            <input
              aria-label="Chat message"
              placeholder="Write a message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={300}
              required
            />
            <button className="btn btn-primary chat-send" disabled={busy}>
              {busy ? "Sending..." : "Send"}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      </section>
    </main>
  );
}
