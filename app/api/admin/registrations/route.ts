import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await getSupabaseAdmin().from("registrations").select("id,name,created_at").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load registrations." }, { status: 500 });
  return NextResponse.json({ registrations: data });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid registration." }, { status: 400 });
  const { error } = await getSupabaseAdmin().from("registrations").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not remove registration." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
