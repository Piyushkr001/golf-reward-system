import type { Metadata } from "next";
import { Exo_2, Noto_Sans_Avestan } from "next/font/google";
import "./globals.css";
import Navbar from "./_shared/Navbar";
import Footer from "./_shared/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const exo = Exo_2({
  variable: "--font-exo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "PlayLance",
  description: "Playlance is a modern platform to play, win rewards, and support charities through one seamless experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" suppressHydrationWarning
      className={`${exo.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
