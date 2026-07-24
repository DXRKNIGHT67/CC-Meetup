import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401});
  const supabase = getSupabaseAdmin();
  const {data,error} = await supabase.from("tickets").select("id,name,subject,details,status,created_at").order("created_at",{ascending:false});
  if (error) return NextResponse.json({error:"Could not load tickets."},{status:500});
  return NextResponse.json({tickets:data || []});
}

export async function PUT(request:NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401});
  const body = await request.json(); const id=Number(body.id); const status=String(body.status || "");
  if (!Number.isInteger(id) || !["open","resolved"].includes(status)) return NextResponse.json({error:"Invalid ticket update."},{status:400});
  const supabase=getSupabaseAdmin(); const {error}=await supabase.from("tickets").update({status}).eq("id",id);
  if (error) return NextResponse.json({error:"Could not update ticket."},{status:500});
  return NextResponse.json({success:true});
}

export async function DELETE(request:NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json(); const id=Number(body.id);
  if (!Number.isInteger(id)) return NextResponse.json({error:"Invalid ticket."},{status:400});
  const supabase=getSupabaseAdmin(); const {error}=await supabase.from("tickets").delete().eq("id",id);
  if (error) return NextResponse.json({error:"Could not delete ticket."},{status:500});
  return NextResponse.json({success:true});
}
