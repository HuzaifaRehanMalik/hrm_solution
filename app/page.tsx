import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import PageViewTracker from "@/app/components/PageViewTracker";
import Process from "@/app/components/Process";
import Services from "@/app/components/Services";
import WhyUs from "@/app/components/WhyUs";

export default function Home() {
  return (
    <>
      <PageViewTracker />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Services />
        <Process />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
