import { createBrowserSupabase } from "@/utils/supabase/client";
import ImageComponent from "../shared/ImageComponent";
import Logo from "../shared/Logo";
import { useState } from "react";

const LoginModal = () => {
  const [loginType, setLoginType] = useState("Sign In");

  const toggleLoginType = () => {
    if (loginType === "Sign In") setLoginType("Sign Up");
    else setLoginType("Sign In");
  };

  const supabase = createBrowserSupabase();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) console.error(error);
  };

  return (
    <div className="w-full h-full flex flex-col items-center space-y-6 p-6 mt-8">
      <Logo version="cut" />
      <div className="flex flex-col space-y-1 items-center">
        <h3 className="font-bold text-black text-2xl">Welcome To Classly</h3>
        <span className="text-xs font-light text-gray-600">
          Ready to start your learning journey?
        </span>
      </div>

      <div className="w-full flex flex-col space-y-3 items-center mt-5">
        <button
          onClick={handleSignIn}
          className="cursor-pointer w-[90%] rounded-full py-3 border border-black flex items-center justify-center space-x-3"
        >
          <ImageComponent
            className="size-5"
            src="/google.png"
            alt="google icon"
          />
          <span className="text-black font-medium text-xs">
            Continue with Google
          </span>
        </button>
        <button className="cursor-pointer w-[90%] rounded-full py-3 bg-black flex items-center justify-center space-x-3">
          <ImageComponent
            className="size-5"
            src="/github.webp"
            alt="github icon"
          />
          <span className="text-white font-medium text-xs">
            Continue with Github
          </span>
        </button>
        <button className="cursor-pointer w-[90%] rounded-full py-3 bg-[#1877F2] flex items-center justify-center space-x-3">
          <ImageComponent
            className="size-5"
            src="/facebook.png"
            alt="google icon"
          />
          <span className="text-white font-medium text-xs">
            Continue with Google
          </span>
        </button>
      </div>
      <p className="text-gray-600 text-xs mt-4">
        Don&apos;t have an account?{" "}
        <span
          onClick={toggleLoginType}
          className="cursor-pointer text-primary font-medium ml-0.5"
        >
          {loginType}
        </span>
      </p>
    </div>
  );
};

export default LoginModal;
