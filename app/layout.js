import { Space_Mono } from "next/font/google";
import { Toaster } from 'sonner';

import { ClerkProvider } from '@clerk/nextjs'

import SheetProvider from '@/providers/sheet-provider';
import Provider from '@/providers/query-provider';
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const space = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Expense Manager",
  description: "Your fully functional expense manager, including accounts, transactions and graphs.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={space.className}>

          <Provider>
            <ThemeProvider
              attribute="class"
              disableTransitionOnChange
            >
              <SheetProvider />
              <Toaster />
              {children}
            </ThemeProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
