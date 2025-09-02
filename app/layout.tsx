import type { Metadata } from "next";
import { redHatText } from "@/libs/font";
import '@/styles/reset.scss'
import "@/styles/globals.scss";
import Header from "@/components/Header";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { ErrorProvider } from "@/components/ErrorBoundary/ErrorContext";
import ErrorPopup from "@/components/ErrorPopup/ErrorPopup";

export const metadata: Metadata = {
  title: "Shopping Cart Demo",
  description: "A modern shopping cart application with error handling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHatText.variable} antialiased`}
      >
        <ErrorProvider>
          <ErrorBoundary>
            <Header />
            {children}
            <ErrorPopup />
          </ErrorBoundary>
        </ErrorProvider>
      </body>
    </html>
  );
}
