import { NextResponse } from "next/server";
import { createServerSupabase } from "@/utils/supabase/server";
import { createUser } from "@/actions/user";
import { AppUser } from "@/types";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/app/dashboard";
  if (!next.startsWith("/")) next = "/app/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = await createServerSupabase();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error(exchangeError);
    return NextResponse.redirect(`${origin}/`);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(userError);
    return NextResponse.redirect(`${origin}/`);
  }

  // 👇 Build AppUser object here
  const now = new Date();

  const appUser: AppUser = {
    // id: user.id,
    name:
      (user.user_metadata.full_name as string) ||
      (user.user_metadata.name as string) ||
      "",
    email: user.email!,
    image_url: (user.user_metadata.avatar_url as string) ?? "",
    created_at: now,
    updated_at: now,
    plan: "starter", // or whatever your default Plan value is
  };

  await createUser(appUser);

  return NextResponse.redirect(`${origin}${next}`);
}
