import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@/theme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strand Logistics | Sample Collection System",
  description: "Streamline diagnostic sample collection documentation",
  robots: "noindex, nofollow", // Prevent search engine indexing
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Header />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  pb: { xs: "env(safe-area-inset-bottom)", sm: 0 },
                }}
              >
                <Container
                  maxWidth="lg"
                  sx={{
                    px: { xs: 2, sm: 3 },
                  }}
                >
                  {children}
                </Container>
              </Box>
              <Footer />
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
