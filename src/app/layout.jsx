import { fontVariables } from "@/fonts/index";
import "./globals.css";
import RootWrapper from "./root-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark no-scrollbar">
      <body className={`${fontVariables} no-scrollbar`}>
        <RootWrapper>{children}</RootWrapper>
      </body>
    </html>
  );
}

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000")
  ),
  title: {
    default: "Doctor Tracker — Healthcare Administration",
    template: "%s | Doctor Tracker",
  },
  description:
    "Comprehensive clinical administration and hospital management platform. Track doctor schedules, manage patient appointments, monitor real-time queues, and gain clinical operational insights with enterprise-grade security.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Doctor Tracker — Healthcare Administration",
    description:
      "Comprehensive clinical administration and hospital management platform. Track doctor schedules, manage patient appointments, monitor real-time queues, and gain clinical operational insights with enterprise-grade security.",
    url: "/",
    siteName: "Doctor Tracker",
    images: [
      {
        url: "/mataImage.png",
        width: 1200,
        height: 1200,
        alt: "Doctor Tracker — Healthcare Administration Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doctor Tracker — Healthcare Administration",
    description:
      "Comprehensive clinical administration and hospital management platform. Track doctor schedules, manage patient appointments, monitor real-time queues, and gain clinical operational insights with enterprise-grade security.",
    images: ["/mataImage.png"],
  },
};
