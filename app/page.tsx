import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import IndexRail from "@/app/components/IndexRail";
import Projects from "@/app/components/Projects";
import Skills from "@/app/components/Skills";

export default function Home() {
  return (
    <>
      <IndexRail />
      <main className="lg:pl-[280px]">
        <Hero />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
