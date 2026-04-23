import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MatdamFloatingButton from "@/components/MatdamFloatingButton";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MatdamFloatingButton />
    </SessionProvider>
  );
}
