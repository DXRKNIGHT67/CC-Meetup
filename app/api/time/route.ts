import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("settings")
      .select("value")
      .eq("key", "meetup_time")
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json({ time: data?.value || process.env.NEXT_PUBLIC_MEETUP_TIME || "Time to be announced" });
  } catch {
    return NextResponse.json({ time: process.env.NEXT_PUBLIC_MEETUP_TIME || "Time to be announced" });
  }
}
