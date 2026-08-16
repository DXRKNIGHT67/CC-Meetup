import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const primaryAdmin =
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD;

  const secondAdmin =
    username === process.env.ADMIN2_USERNAME &&
    password === process.env.ADMIN2_PASSWORD;

  if (!primaryAdmin && !secondAdmin) {
    return NextResponse.json(
      { error: "Incorrect username or password." },
      { status: 401 }
    );
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
