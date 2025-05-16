import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import ComingSoon from "@/components/ComingSoon";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

// List of production domains that should show the Coming Soon page
const PRODUCTION_DOMAINS = ["aitools.ninja", "www.aitools.ninja"];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  // Debug logging
  console.log("Current host:", host);
  console.log("Is production domain:", PRODUCTION_DOMAINS.includes(host));
  
  // Check if we're on a production domain
  if (PRODUCTION_DOMAINS.includes(host)) {
    console.log("Showing Coming Soon page for production domain");
    return (
      <html lang={locale}>
        <body className={inter.className}>
          <ComingSoon />
        </body>
      </html>
    );
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <GoogleAnalytics />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
              <Header locale={locale} />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 