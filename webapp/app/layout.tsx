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
