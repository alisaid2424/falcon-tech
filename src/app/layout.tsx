import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";
import ReduxProvider from "@/providers/ReduxProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Falcon Tech",
  description:
    "Falcon tech is an innovative online platform dedicated to providing a wide range of programming books and software manuals. Designed for developers and tech enthusiasts, the platform offers a seamless and secure shopping experience, allowing you to easily purchase books and resources to enhance your skills. Start exploring today and unlock a world of knowledge for your",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <NextAuthSessionProvider>
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <Toaster />
              <main className="min-h-[calc(100vh-64px)]">{children}</main>
              <Footer />
            </ThemeProvider>
          </ReduxProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
