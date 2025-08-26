import Image from "next/image";

const AboutUs: React.FC = () => {
  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-[40px]  font-[900] text-[#252650] mb-4">
            About Us
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Text Content - Second on mobile, First on desktop */}
          <div className="order-2 lg:order-1 space-y-6 font-medium">
            <p className="text-base lg:text-lg leading-relaxed text-[#515151]">
              At Spring Lane Nursery, we believe every child deserves a
              nurturing and enriching start to life. Our mission is to create a
              space where young children feel safe, valued, and inspired to
              explore the world around them.
            </p>

            <p className="text-base lg:text-lg leading-relaxed text-[#515151]">
              Located in a peaceful corner of Croydon, our nursery welcomes
              children from 3 months to 5 years, supporting them through each
              stage of their early development. We focus on building strong
              relationships, developing confidence, and encouraging curiosity
              through a play-based approach that follows the Early Years
              Foundation Stage (EYFS) framework.
            </p>

            {/* Custom Shaped Button */}
            <div className="pt-2">
              <button
                className="relative cursor-pointer overflow-hidden text-white font-medium text-sm lg:text-base px-8 py-3 lg:px-10 lg:py-4 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                style={{
                  backgroundColor: "#F95269",
                  borderRadius: "0px 25px 25px 25px",
                }}
              >
                Read More
              </button>
            </div>
          </div>

          {/* Image - First on mobile, Second on desktop */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/assets/about-img.png"
                alt="Children playing and learning at Spring Lane Nursery"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
