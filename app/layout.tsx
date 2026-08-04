import type { Metadata } from "next";
import { headers } from "next/headers";
import { siteConfig } from "./lib/siteConfig";
import "./globals.css";

const siteDescription =
  "Know how many staff you need before building the rota. ScheduleLoop turns expected demand into practical staffing guidance for shift-based businesses.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host ? new URL(`${protocol}://${host}`) : new URL("http://localhost:3000");

  return {
    metadataBase,
    title: {
      default: "ScheduleLoop | Demand Forecasting and Staffing Planning",
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
      title: "ScheduleLoop | Demand Forecasting and Staffing Planning",
      description: siteDescription,
      url: siteConfig.url,
      siteName: "ScheduleLoop",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "ScheduleLoop demand-shaped staffing plans",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "ScheduleLoop",
      description: siteDescription,
      images: ["/og.png"],
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
