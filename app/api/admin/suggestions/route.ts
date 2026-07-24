import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("suggestions").select("id,name,suggestion,created_at").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load suggestions." }, { status: 500 });
  return NextResponse.json({ suggestions: data || [] });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const id = Number(body.id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid suggestion." }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("suggestions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete suggestion." }, { status: 500 });
  return NextResponse.json({ success: true });
}
