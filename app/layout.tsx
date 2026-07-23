import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CC Meetup",
  description: "Register for the CC Meetup and view the meetup code.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
