import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await getSupabaseAdmin()
    .from("settings")
    .select("value")
    .eq("key", "meetup_time")
    .maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load meetup time." }, { status: 500 });
  return NextResponse.json({ time: data?.value || process.env.NEXT_PUBLIC_MEETUP_TIME || "Time to be announced" });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { time } = await request.json();
  const clean = typeof time === "string" ? time.trim() : "";
  if (!clean) return NextResponse.json({ error: "Enter a meetup time." }, { status: 400 });
  if (clean.length > 100) return NextResponse.json({ error: "Meetup time must be 100 characters or fewer." }, { status: 400 });
  const { error } = await getSupabaseAdmin()
    .from("settings")
    .upsert({ key: "meetup_time", value: clean }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: "Could not update meetup time." }, { status: 500 });
  return NextResponse.json({ ok: true, time: clean });
}
