import { Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Header from "./app/components/Layout/Header";
import Footer from "./app/components/Layout/Footer";
import ScrollToTop from "./app/components/ScrollToTop";
import "./app/globals.css";

export default function App() {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <div className="antialiased dark:bg-darkmode min-h-screen">
        <Header />
        <Outlet />
        <Footer />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}
