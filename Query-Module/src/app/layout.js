import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/sidebar";
import AuthWrapper from "./authReduxWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GreenTip-QueryMoule",
  description: "AI powered farming assistant",
};

export default function RootLayout({ children }) {
  return (
    // <html lang="en" suppressHydrationWarning>  //! For production ready app
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthWrapper>
            <div className="p-2 flex items-center border-b-[1px] border-emerald-100">
              <Sidebar />
            </div>
            {children}
          </AuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
