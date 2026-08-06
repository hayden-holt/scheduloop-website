import type { Metadata } from "next";
import { headers } from "next/headers";
import { siteConfig } from "./lib/siteConfig";
import "./globals.css";

const siteDescription =
  "Understand expected demand, plan the staffing coverage you need and build the employee rota around it with ScheduleLoop.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host ? new URL(`${protocol}://${host}`) : new URL("http://localhost:3000");

  return {
    metadataBase,
    title: {
      default: "ScheduleLoop | Demand Forecasting, Staffing Planning and Rotas",
      template: "%s",
    },
    description: siteDescription,
    alternates: {
      canonical: siteConfig.url,
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "ScheduleLoop | Demand Forecasting, Staffing Planning and Rotas",
      description: siteDescription,
      url: siteConfig.url,
      siteName: "ScheduleLoop",
      images: [
        {
          url: "/og-rota.png",
          width: 1200,
          height: 630,
          alt: "ScheduleLoop demand forecasting, staffing planning and rota workflow",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "ScheduleLoop",
      description: siteDescription,
      images: ["/og-rota.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
