import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const Pop = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Make Sam Happy",
  description: "Sam is a sad, lonely and depressed person. Help him out!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Pop.className} antialiased`}>{children}</body>
    </html>
  );
}
