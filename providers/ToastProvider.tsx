"use client";

type ToastType = "success" | "error";

import { useContext, createContext, useState, useRef } from "react";
import { X, TriangleAlert, CircleCheck } from "lucide-react";

type ToastPayload = {
  title: string;
  description?: string;
  type: ToastType;
};

type ContextType = {
  toast: (payload: ToastPayload) => void;
};

const Ctx = createContext<ContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toastContent, setToastContent] = useState<ToastPayload | null>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused = useRef(false);
  const remainingRef = useRef(2000);
  const startTimeRef = useRef(0);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startDismissTimer = (duration: number) => {
    clearTimers();
    remainingRef.current = duration;
    startTimeRef.current = Date.now();
    setProgress((duration / 4000) * 100);

    intervalRef.current = setInterval(() => {
      if (isPaused.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = duration - elapsed;
      setProgress(Math.max((remaining / 2000) * 100, 0));
    }, 50);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      clearTimers();
    }, duration);
  };

  const toast = (payload: ToastPayload) => {
    clearTimers();
    setVisible(false);

    // small delay to allow re-mount animation if a toast is already showing
    setTimeout(() => {
      setToastContent(payload);
      setProgress(100);
      setVisible(true);
      isPaused.current = false;
      startDismissTimer(2000);
    }, 50);
  };

  const handleClose = () => {
    setVisible(false);
    clearTimers();
  };

  const handleMouseEnter = () => {
    isPaused.current = true;
    remainingRef.current =
      remainingRef.current - (Date.now() - startTimeRef.current);
    clearTimers();
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
    startTimeRef.current = Date.now();
    startDismissTimer(remainingRef.current);
  };

  const value = { toast };

  return (
    <Ctx.Provider value={value}>
      {children}
      {visible && toastContent && (
        <Toast
          type={toastContent.type}
          title={toastContent.title}
          description={toastContent.description}
          progress={progress}
          onClose={handleClose}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </Ctx.Provider>
  );
}

function Toast({
  type,
  title,
  description,
  progress,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  type: ToastType;
  title: string;
  description?: string;
  progress: number;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const isSuccess = type === "success";

  const accent = isSuccess ? "#35f527" : "#ef4444";
  const iconBg = isSuccess ? "#e8f5ec" : "#fef2f2";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "320px",
        zIndex: 9999,
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        borderLeft: `4px solid ${accent}`,
        overflow: "hidden",
        animation: "toastSlideIn 0.3s ease forwards",
        fontFamily: "var(--font-sora)",
      }}
    >
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 16px 12px 16px",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isSuccess ? (
            <CircleCheck
              style={{ color: accent, width: "20px", height: "20px" }}
            />
          ) : (
            <TriangleAlert
              style={{ color: accent, width: "20px", height: "20px" }}
            />
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {title}
          </p>
          {description && (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "12px",
                color: "#6b7280",
                lineHeight: "1.4",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#9ca3af",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X style={{ width: "16px", height: "16px" }} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: "3px", backgroundColor: "#f3f4f6" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: accent,
            transition: "width 50ms linear",
          }}
        />
      </div>
    </div>
  );
}
