import React from "react";
import Image from "next/image";

interface InfoItem {
  id: string;
  icon: React.ReactNode;
  text: string;
}

const ScrollingInfoSection: React.FC = () => {
  const infoItems: InfoItem[] = [
    {
      id: "1",
      icon: (
        <Image
          src="/assets/clock-scroll.svg"
          alt="Clock icon"
          width={20}
          height={20}
          className="text-white"
        />
      ),
      text: "Mon-Fri: 7:00am – 6:00pm",
    },
    {
      id: "2",
      icon: (
        <Image
          src="/assets/user.svg"
          alt="Users icon"
          width={20}
          height={20}
          className="text-white"
        />
      ),
      text: "Welcoming 3 months - 5 years",
    },
    {
      id: "3",
      icon: (
        <Image
          src="/assets/building.svg"
          alt="Building icon"
          width={20}
          height={20}
          className="text-white"
        />
      ),
      text: "Government Funded",
    },
    {
      id: "4",
      icon: (
        <Image
          src="/assets/external.svg"
          alt="External link icon"
          width={20}
          height={20}
          className="text-white"
        />
      ),
      text: "Extended Hours Available",
    },
  ];

  // Duplicate items for seamless looping
  const duplicatedItems = [...infoItems, ...infoItems];

  return (
    <div
      className="w-full py-[40px] overflow-hidden"
      style={{ backgroundColor: "#5D9394" }}
    >
      <div className="flex w-full animate-scroll-left">
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex w-full items-center gap-3 px-8 whitespace-nowrap"
          >
            <div className="flex-shrink-0 w-5 h-5">{item.icon}</div>
            <span className="text-white font-medium text-sm md:text-base">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingInfoSection;
