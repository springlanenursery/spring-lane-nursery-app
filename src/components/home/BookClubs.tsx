// Book Clubs Section
interface BookClub {
  title: string;
  price: string;
  description: string;
  time: string;
  backgroundColor: string;
  titleColor: string;
  buttonColor: string;
}

const BookClubs: React.FC = () => {
  const bookClubs: BookClub[] = [
    {
      title: "Breakfast Club",
      price: "£8.00",
      description:
        "We operate a rolling admissions policy & welcome children throughout the year, depending on availability.We operate a rolling admissions policy & welcome children throughout the year, depending on availability.",
      time: "6:30AM - 7:30AM",
      backgroundColor: "#FC4C171A", // Orange with alpha (same as football)
      titleColor: "#FC4C17", // Orange
      buttonColor: "#F95269", // Pink/Red
    },
    {
      title: "After Hours Club",
      price: "£8.00",
      description:
        "We operate a rolling admissions policy & welcome children throughout the year, depending on availability.We operate a rolling admissions policy & welcome children throughout the year, depending on availability.",
      time: "6:00PM - 7:00PM",
      backgroundColor: "#F9AE151A", // Yellow with alpha (same as cricket)
      titleColor: "#F9AE15", // Yellow
      buttonColor: "#F9AE15", // Yellow
    },
  ];

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-[40px]  font-[900] text-[#252650] mb-4">
            Book Clubs
          </h2>
        </div>

        {/* Book Clubs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
          {bookClubs.map((club, index) => (
            <div
              key={index}
              className="rounded-[10px] p-6 lg:p-8 xl:p-10"
              style={{ backgroundColor: club.backgroundColor }}
            >
              {/* Header with Title and Price */}
              <div className="flex items-start justify-between mb-4 lg:mb-6">
                <h3
                  className="text-2xl lg:text-3xl xl:text-4xl font-[900]"
                  style={{ color: club.titleColor }}
                >
                  {club.title}
                </h3>
                <span
                  className="text-xl lg:text-2xl xl:text-3xl font-bold"
                  style={{ color: club.titleColor }}
                >
                  {club.price}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm lg:text-base leading-relaxed text-[#515151] mb-4 lg:mb-6">
                {club.description}
              </p>

              {/* Time */}
              <p className="text-sm lg:text-base font-medium text-[#252650] mb-6 lg:mb-8">
                {club.time}
              </p>

              {/* Book Now Button */}
              <button
                className="text-white cursor-pointer font-medium text-sm lg:text-base px-6 py-3 lg:px-8 lg:py-4 rounded-[10px] hover:opacity-90 transition-opacity duration-300"
                style={{ backgroundColor: club.buttonColor }}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookClubs;
