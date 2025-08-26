import AboutUs from "@/components/home/AboutUs";
import AdmissionsEnrolment from "@/components/home/AdmissionsEnrolment";
import AvailabilityWaitingList from "@/components/home/AvailabilityWaitingList";
import BookClubs from "@/components/home/BookClubs";
import CourseCurriculum from "@/components/home/CourseCurriculum";
import EnquireNow from "@/components/home/EnquireNow";
import ExtraCurriculum from "@/components/home/ExtraCurriculum";
import FAQ from "@/components/home/Faqs";
import Footer from "@/components/common/Footer";
import GovernmentFundedChildcare from "@/components/home/GovernmentFundedChildcare";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import OurClassrooms from "@/components/home/OurClassrooms";
import OurLocation from "@/components/home/OurLocation";
import PhotoGallery from "@/components/home/PhotoGallery";
import Tour from "@/components/home/Tour";
import Welcome from "@/components/home/Welcome";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import ScrollingInfo from "@/components/home/ScrollingInfo";

export default function Home() {
  return (
    <main className="max-w-[1440px] mx-auto font-sans">
      <Navbar />
      <div id="hero">
        <Hero />
      </div>
      <ScrollingInfo />
      <Welcome />
      <div id="about-us">
        <AboutUs />
      </div>
      <div id="curriculum">
        <CourseCurriculum />
        <ExtraCurriculum />
      </div>
      <OurClassrooms />
      <BookClubs />
      <div id="gallery">
        <PhotoGallery />
      </div>
      <Tour />
      <Testimonials />
      <AvailabilityWaitingList />
      <AdmissionsEnrolment />
      <GovernmentFundedChildcare />
      <OurLocation />
      <CTA />
      <FAQ />
      <Footer />
    </main>
  );
}
