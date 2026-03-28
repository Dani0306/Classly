import { updateSession } from "./utils/supabase/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "./utils/supabase/server";

export async function proxy(req: NextRequest) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && req.nextUrl.pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return await updateSession(req);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/app/:path*",
  ],
};
