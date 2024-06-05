import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "../globals.css";
import clsx from "clsx";
import ThemeProvider from "@/src/theme/ThemeProvider";

const dmSans = DM_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next Garou",
  description: "The new wolf game generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={clsx(dmSans.className, 'bg-background h-full')}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
