import LandingCards from "@/components/landing/LandingCards";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import { createServerSupabase } from "@/utils/supabase/server";

const Home = async () => {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="w-full flex flex-col">
      <LandingHeader user={user} />
      <LandingHero user={user} />
      <LandingCards />
      <LandingPricing />
      <LandingTestimonials />
      <LandingFooter />
    </div>
  );
};

export default Home;
