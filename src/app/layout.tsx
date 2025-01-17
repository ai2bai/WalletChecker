import type { Metadata } from "next";
import "./globals.css";
import SolanaProvider from "./SolanaProvider";


export const metadata: Metadata = {
  title: "ai2b - 2B or Not 2B",
  description: "ai2b - 2B or Not 2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
