import Aside from "@/components/sidebar/Aside";
import { createServerSupabase } from "@/utils/supabase/server";

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Aside user={user!}>{children}</Aside>;
}
