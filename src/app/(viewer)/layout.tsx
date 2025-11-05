import type { Metadata } from "next";
import "@/app/globals.css";
import { Provider } from '@/lib/components/ui/provider'

export const metadata: Metadata = {
  title: "PDF Viewer - Concordpedia",
  description: "©Joshua Ng, Xingzhi Lu, Christoph Chan 2025",
};

/**
 * Minimal layout for the PDF viewer
 * No navbar, footer, or content constraints for full-screen experience
 */
export default function ViewerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </Provider>
  );
}

