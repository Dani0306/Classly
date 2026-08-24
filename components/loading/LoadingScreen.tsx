const LoadingScreen = ({ message }: { message?: string }) => {
  return (
    <div
      style={{
        width: "max-content",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        backgroundColor: "transparent",
        fontFamily: "var(--font-sora)",
      }}
    >
      <style>{`
        @keyframes classlyBarPulse {
          0%, 100% { transform: scaleY(0.3); opacity: 0.4; }
          50%       { transform: scaleY(1);   opacity: 1;   }
        }

        .classly-bar {
          width: 5px;
          border-radius: 999px;
          background: #35f527;
          transform-origin: bottom;
          animation: classlyBarPulse 1.1s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(53, 245, 39, 0.5);
        }

        @keyframes classlyFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .classly-loading-label {
          animation: classlyFadeIn 0.6s ease forwards;
        }
      `}</style>

      {/* Animated bars */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "6px",
          height: "48px",
        }}
      >
        {[
          { height: "28px", delay: "0s" },
          { height: "40px", delay: "0.15s" },
          { height: "48px", delay: "0.3s" },
          { height: "40px", delay: "0.45s" },
          { height: "28px", delay: "0.6s" },
        ].map((bar, i) => (
          <div
            key={i}
            className="classly-bar"
            style={{
              height: bar.height,
              animationDelay: bar.delay,
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p
        className="classly-loading-label"
        style={{
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
          margin: 0,
        }}
      >
        {message ?? "Loading ..."}
      </p>
    </div>
  );
};

export default LoadingScreen;
