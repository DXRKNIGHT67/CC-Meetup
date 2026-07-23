import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { code } = await request.json();
  const clean = typeof code === "string" ? code.trim() : "";
  if (clean.length > 80) return NextResponse.json({ error: "Code must be 80 characters or fewer." }, { status: 400 });
  const { error } = await getSupabaseAdmin().from("settings").upsert({ key: "meetup_code", value: clean || "No code has been posted yet" }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: "Could not update code." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
