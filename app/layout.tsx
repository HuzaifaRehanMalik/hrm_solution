import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/app/components/motion/SmoothScroll";
import { services, siteConfig } from "@/app/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "HRM Solution builds AI agents, workflow automation, internal tools and custom web applications that turn manual work into intelligent systems.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brand}: AI Agents, Automation & Custom Software`,
    template: `%s | ${siteConfig.brand}`,
  },
  description,
  alternates: { canonical: "/" },
  keywords: [
    "AI agents",
    "workflow automation",
    "business automation",
    "internal tools",
    "AI chatbots",
    "custom software development",
    "web development",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.brand,
    title: `${siteConfig.brand}: AI Agents, Automation & Custom Software`,
    description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand}: AI Agents, Automation & Custom Software`,
    description,
  },
};

const siteUrl = siteConfig.url.replace(/\/$/, "");

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteConfig.brand,
      description,
      url: siteUrl,
      email: siteConfig.email,
      logo: `${siteUrl}/logo-mark.png`,
      founder: {
        "@type": "Person",
        name: siteConfig.founder,
        jobTitle: siteConfig.founderRole,
        url: siteConfig.portfolioUrl,
      },
      sameAs: [siteConfig.portfolioUrl, siteConfig.githubUrl],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description,
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteConfig.brand,
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {/* Scroll-reveal content starts hidden and is shown by JS; without JS
            it would stay invisible. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:text-accent-foreground"
        >
          Skip to content
        </a>
        {children}
        <div aria-hidden="true" className="grain" />
        {/* A sibling, not a wrapper: toggling it never remounts the page. */}
        <SmoothScroll />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Escape "<" so no string in the data can close the script tag.
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
