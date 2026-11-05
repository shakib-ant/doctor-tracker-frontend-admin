import { fontVariables } from "@/fonts/index";
import "./globals.css";
import RootWrapper from "./root-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark no-scrollbar">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={`${fontVariables} no-scrollbar`}>
        <RootWrapper>{children}</RootWrapper>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    default: "Doctor Tracker — Healthcare Administration",
    template: "%s | Doctor Tracker",
  },
  description: "Doctor Tracker — Modern Dark Healthcare Dashboard",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};
