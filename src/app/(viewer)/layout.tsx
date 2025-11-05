import { Provider } from '@/lib/components/ui/provider'

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

