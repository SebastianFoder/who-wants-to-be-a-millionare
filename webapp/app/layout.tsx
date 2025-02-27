import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hvem vil være millionær?",
  description: "Hvem vil være millionær?",
  icons: {
    apple: [
      { url: "/img/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/img/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/img/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/img/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/img/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/img/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/img/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/img/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/img/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    icon: [
      { url: "/img/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/img/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/img/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/img/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/img/manifest.json" },
      { 
        rel: "msapplication-TileImage", 
        url: "/img/ms-icon-144x144.png" 
      },
    ],
  },
  themeColor: "#1e183a",
  other: {
    "msapplication-TileColor": "#1e183a",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`
          ${montserrat.variable} 
          antialiased 
          min-h-screen
          relative
          xl:h-screen
          xl:overflow-hidden
        `}
      >
        {/* Background Image */}
        <div 
          className="
            fixed inset-0 
            bg-[url('/img/background.jpg')] 
            bg-cover bg-center bg-no-repeat
            blur-sm
            brightness-50
            z-0
          "
          aria-hidden="true"
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
