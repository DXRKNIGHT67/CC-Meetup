import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request:NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const subject = String(body.subject || "").trim();
    const details = String(body.details || "").trim();
    if (name.length < 2 || name.length > 50) return NextResponse.json({error:"Enter a valid name."},{status:400});
    if (subject.length < 3 || subject.length > 100) return NextResponse.json({error:"Enter a short description of the problem."},{status:400});
    if (details.length < 5 || details.length > 1500) return NextResponse.json({error:"Please explain the problem in a little more detail."},{status:400});
    const supabase = getSupabaseAdmin();
    const {error} = await supabase.from("tickets").insert({name,subject,details,status:"open"});
    if (error) return NextResponse.json({error:"Could not create ticket."},{status:500});
    return NextResponse.json({success:true});
  } catch {
    return NextResponse.json({error:"Invalid request."},{status:400});
  }
}
