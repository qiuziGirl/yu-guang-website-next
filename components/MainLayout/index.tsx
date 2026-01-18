"use client";

import HeaderComponent from "@/components/Header";
import FooterComponent from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex justify-between items-center h-16 px-20 bg-white shadow-sm">
        <HeaderComponent />
      </header>
      <main className="flex-1 text-center text-gray-800">
        {children}
      </main>
      <footer className="flex flex-col text-center text-white bg-[#316bab] py-6">
        <FooterComponent />
      </footer>
    </div>
  );
}
