import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const suggestion = String(body.suggestion || "").trim();
    if (name.length < 2 || name.length > 50) return NextResponse.json({ error: "Enter a valid name." }, { status: 400 });
    if (suggestion.length < 3 || suggestion.length > 1000) return NextResponse.json({ error: "Suggestion must be between 3 and 1000 characters." }, { status: 400 });
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("suggestions").insert({ name, suggestion });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not send suggestion." }, { status: 500 });
  }
}
