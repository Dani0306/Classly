import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppModalProvider from "@/providers/AppModalProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const sora = localFont({
  src: [
    {
      path: "../fonts/Sora-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/Sora-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/Sora-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Sora-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Sora-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Sora-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Sora-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Sora-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Classly | AI-Powered Study & Note Taking",
  description:
    "Classly is an AI-powered academic workspace designed to help students organize classes, structure ideas, refine notes, and manage homework effortlessly. Create smart explanations, correct grammar, convert images to text, and stay focused — all in one intelligent platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("light", "font-sans", geist.variable)}>
      <body className={`${sora.variable}`}>
        <AppModalProvider>{children}</AppModalProvider>
      </body>
    </html>
  );
}
