"use client";

import { RefreshCw, Home, Zap, Brain } from "lucide-react";
import Link from "next/link";

const ErrorScreen = ({ error }: { error: Error }) => {
  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Large decorative background error code */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <h1
          className="font-bold leading-none tracking-tighter opacity-50"
          style={{
            fontFamily: "var(--font-sora)",
            fontSize: "clamp(8rem, 20vw, 22rem)",
            color: "var(--border)",
          }}
        >
          500
        </h1>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Illustration */}
        <div className="mb-12 relative">
          {/* Outer ambient glow */}
          <div
            className="absolute inset-0 rounded-full scale-75 animate-pulse blur-[60px]"
            style={{ backgroundColor: "rgba(53, 245, 39, 0.12)" }}
          />

          {/* Icon frame */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Pulsing ring */}
            <div
              className="absolute inset-0 rounded-full border-2 animate-ping"
              style={{ borderColor: "rgba(53, 245, 39, 0.2)" }}
            />
            <div
              className="absolute inset-4 rounded-full border animate-pulse"
              style={{ borderColor: "rgba(53, 245, 39, 0.15)" }}
            />

            {/* Main icon container */}
            <div
              className="relative w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--surface-green)",
                boxShadow:
                  "0 0 30px rgba(53, 245, 39, 0.25), 0 0 60px rgba(53, 245, 39, 0.1)",
              }}
            >
              <Brain
                className="w-16 h-16"
                style={{
                  color: "var(--primary)",
                  filter:
                    "drop-shadow(0 0 8px rgba(53, 245, 39, 0.6)) drop-shadow(0 0 20px rgba(53, 245, 39, 0.3))",
                }}
              />
            </div>

            {/* Floating accent icons */}
            <div
              className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--surface-green-strong)" }}
            >
              <Zap
                className="w-4 h-4"
                style={{ color: "var(--primary-hover)" }}
              />
            </div>
            <div
              className="absolute bottom-8 left-6 w-7 h-7 rounded-full flex items-center justify-center opacity-60"
              style={{ backgroundColor: "var(--surface-green)" }}
            >
              <Zap className="w-3 h-3" style={{ color: "var(--primary)" }} />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4 mb-10">
          <h2
            className="font-bold text-3xl md:text-4xl tracking-tight"
            style={{
              fontFamily: "var(--font-sora)",
              color: "var(--foreground)",
            }}
          >
            Something went wrong
          </h2>
          <p
            className="text-[15px] leading-relaxed px-4"
            style={{ color: "var(--muted-foreground)" }}
          >
            {error?.message
              ? error.message
              : "We couldn&apos;t load this page. It might be a temporary issue — give it another try."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={handleTryAgain}
            className="group flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm transition-all duration-300 active:scale-95"
            style={{
              fontFamily: "var(--font-sora)",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              boxShadow: "0 0 12px rgba(53, 245, 39, 0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 25px rgba(53, 245, 39, 0.6), 0 0 50px rgba(53, 245, 39, 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px rgba(53, 245, 39, 0.3)";
            }}
          >
            <RefreshCw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            Try Again
          </button>

          <Link
            href="/app/dashboard"
            className="flex items-center gap-2 px-8 py-4 text-sm font-medium transition-colors duration-200"
            style={{
              fontFamily: "var(--font-sora)",
              color: "var(--muted-foreground)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--primary-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--muted-foreground)";
            }}
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Support footer */}
        <div
          className="mt-16 flex items-center gap-4 text-xs opacity-40"
          style={{ color: "var(--muted-foreground)" }}
        >
          <span>Support ID: 4920-AI-FAIL</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span className="uppercase tracking-wide">
            System Status: Warning
          </span>
        </div>
      </div>

      {/* Ambient background blobs */}
      <div
        className="absolute top-20 right-[15%] w-32 h-32 rounded-full blur-[50px] pointer-events-none"
        style={{ backgroundColor: "rgba(53, 245, 39, 0.06)" }}
      />
      <div
        className="absolute bottom-40 left-[10%] w-48 h-48 rounded-full blur-[60px] pointer-events-none"
        style={{ backgroundColor: "rgba(53, 245, 39, 0.04)" }}
      />
    </main>
  );
};

export default ErrorScreen;
