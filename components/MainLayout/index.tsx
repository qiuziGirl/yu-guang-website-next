import HeaderComponent from "@/components/Header";
import FooterComponent from "@/components/Footer";
import { getNavCategories } from "@/lib/data";
import { readSiteLang } from "@/lib/site-lang-server";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const [navCategories, lang] = await Promise.all([
    getNavCategories(),
    readSiteLang(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex justify-between items-center h-16 lg:h-20 px-4 sm:px-6 lg:px-16 bg-white shadow-sm">
        <HeaderComponent categories={navCategories} initialLang={lang} />
      </header>
      <main className="flex-1 text-center text-gray-800">
        {children}
      </main>
      <footer className="relative z-10 flex flex-col text-center text-white bg-[#316bab] py-8">
        <FooterComponent initialLang={lang} />
      </footer>
    </div>
  );
}
