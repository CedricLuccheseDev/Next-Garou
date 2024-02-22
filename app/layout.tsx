import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./(ui)/Header";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Garou",
  description: "The next generation wolf game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <main className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-4xl">{children}</main>
      </body>
    </html>
  );
}
