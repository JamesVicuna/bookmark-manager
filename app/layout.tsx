import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Providers } from "./components/Providers";
import { AuthenticationWrapper } from "./components/AuthenticationWrapper";

export const metadata: Metadata = {
  title: "Bookmark Manager",
  description:
    "Developed by James Vicuna. Assets provided by FrontEndMentor.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <AuthenticationWrapper>
        <html lang="en" data-theme="mytheme">
          <body className={`antialiased bg-base-200`}>
            <Navbar>
              <div className="min-h-[calc(100vh-6rem)]">
                <div className="mx-8 mt-8">{children}</div>
              </div>
            </Navbar>
          </body>
        </html>
      </AuthenticationWrapper>
    </Providers>
  );
}
