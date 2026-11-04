import { fontVariables } from "@/fonts/index";
import "./globals.css";
import RootWrapper from "./root-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={fontVariables}>
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
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};
