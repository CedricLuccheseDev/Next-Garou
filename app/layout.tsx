import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import ThemeProvider from "@/src/theme/ThemeProvider";
import Header from "@/src/layout/Header";

const inter = Inter({ subsets: ["latin"] });
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
    <html lang="en" className="h-full">
      <body className={clsx(dmSans.className, 'bg-background h-full')}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <div className="flex flex-col h-full p-4">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
