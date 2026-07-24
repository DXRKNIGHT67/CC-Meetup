import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id,name,message,created_at")
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: "Could not load chat." }, { status: 500 });
  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (name.length < 2 || name.length > 30) {
    return NextResponse.json({ error: "Name must be between 2 and 30 characters." }, { status: 400 });
  }
  if (message.length < 1 || message.length > 300) {
    return NextResponse.json({ error: "Message must be between 1 and 300 characters." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("chat_messages").insert({ name, message });
  if (error) return NextResponse.json({ error: "Message could not be saved." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
