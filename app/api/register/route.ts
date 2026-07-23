import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: "Enter a name between 2 and 50 characters." }, { status: 400 });
    }
    const { error } = await getSupabaseAdmin().from("registrations").insert({ name });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save the registration." }, { status: 500 });
  }
}
