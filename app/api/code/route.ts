import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin().from("settings").select("value").eq("key", "meetup_code").maybeSingle();
    if (error) throw error;
    return NextResponse.json({ code: data?.value || "No code has been posted yet" });
  } catch {
    return NextResponse.json({ code: "Code unavailable" }, { status: 500 });
  }
}
