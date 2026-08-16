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

    if (error) {
      console.error("Registration insert failed:", error.message, error.code);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    console.error("Registration route failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
