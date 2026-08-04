import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const siteDescription =
  "Daily staffing guidance shaped around demand, roles and local business context.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host ? new URL(`${protocol}://${host}`) : new URL("http://localhost:3000");

  return {
    metadataBase,
    title: "ScheduleLoop",
    description: siteDescription,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "ScheduleLoop",
      description: siteDescription,
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
