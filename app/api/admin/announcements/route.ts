import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from("announcements")
    .select("id,title,message,created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load announcements." }, { status: 500 });
  return NextResponse.json({ announcements: data || [] });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const title = String(body.title || "").trim();
  const message = String(body.message || "").trim();
  if (title.length < 2 || title.length > 80) return NextResponse.json({ error: "Title must be 2–80 characters." }, { status: 400 });
  if (message.length < 1 || message.length > 1000) return NextResponse.json({ error: "Announcement must be 1–1000 characters." }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("announcements").insert({ title, message }).select().single();
  if (error) return NextResponse.json({ error: "Could not post announcement." }, { status: 500 });
  return NextResponse.json({ announcement: data });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const id = Number(body.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid announcement." }, { status: 400 });
  const { error } = await supabaseAdmin.from("announcements").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete announcement." }, { status: 500 });
  return NextResponse.json({ success: true });
}
