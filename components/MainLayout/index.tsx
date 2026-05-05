import HeaderComponent from "@/components/Header";
import FooterComponent from "@/components/Footer";
import { getNavCategories } from "@/lib/data";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const navCategories = await getNavCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex justify-between items-center h-20 px-16 bg-white shadow-sm">
        <HeaderComponent categories={navCategories} />
      </header>
      <main className="flex-1 text-center text-gray-800">
        {children}
      </main>
      <footer className="relative z-10 flex flex-col text-center text-white bg-[#316bab] py-8">
        <FooterComponent />
      </footer>
    </div>
  );
}
