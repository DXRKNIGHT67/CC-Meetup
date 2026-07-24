import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("announcements")
    .select("id,title,message,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: "Could not load announcements." }, { status: 500 });
  return NextResponse.json({ announcements: data || [] });
}
