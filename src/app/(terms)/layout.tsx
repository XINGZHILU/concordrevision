import type { Metadata } from "next";
import "@/app/globals.css";
import "@/app/md.css";
import { Provider } from '@/lib/components/ui/provider'

export const metadata: Metadata = {
  title: "Terms & Privacy - Concordpedia",
  description: "Terms and Conditions and Privacy Policy for Concordpedia",
};

/**
 * Minimal public layout for Terms and Privacy pages
 * Accessible to everyone without requiring authentication
 */
export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Main content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright and All Rights Reserved */}
            <div className="text-sm text-muted-foreground order-2 md:order-1 text-center md:text-left">
              All rights reserved. ©Joshua Ng, Xingzhi Lu, Christoph Chan {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </Provider>
  );
}