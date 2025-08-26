"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";

// FAQ Section
interface FAQItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqItems: FAQItem[] = [
    {
      question: "What ages do you cater for?",
      answer:
        "Spring Lane Nursery welcomes children aged 0 to 5 years. We offer age-appropriate care and learning opportunities tailored to support each stage of your child's development.",
    },
    {
      question: "Do you use a key person system?",
      answer:
        "Yes, we operate a key person system to ensure each child has a designated staff member who knows them well and can support their individual needs and development.",
    },
    {
      question: "How can I keep up with my child's progress?",
      answer:
        "We provide regular updates through our online learning journal system, daily communications, and scheduled parent meetings to keep you informed of your child's progress and achievements.",
    },
    {
      question: "What is included in the nursery fees?",
      answer:
        "Our nursery fees include all meals, snacks, nappies, educational activities, and access to all our facilities and resources. There are no hidden costs for day-to-day care.",
    },
    {
      question: "What does a typical day look like at Spring Lane Nursery?",
      answer:
        "A typical day includes free play, structured learning activities, outdoor time, meals and snacks, rest periods for younger children, and various educational experiences following the EYFS framework.",
    },
    {
      question: "How do you support new children to settle in?",
      answer:
        "We offer flexible settling-in sessions, work closely with parents to understand each child's needs, and our key person system ensures new children have consistent support during their transition.",
    },
    {
      question: "What are your staff-to-child ratios?",
      answer:
        "We maintain excellent staff-to-child ratios that exceed regulatory requirements: 1:3 for children under 2 years, 1:4 for 2-year-olds, and 1:8 for children aged 3-5 years.",
    },
    {
      question: "What safety and safeguarding measures are in place?",
      answer:
        "We have comprehensive safeguarding policies, secure entry systems, CCTV monitoring, regular risk assessments, and all staff are fully trained in child protection and first aid.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-12 lg:py-20  relative overflow-hidden">      
      <div className="hidden lg:block absolute bottom-0 left-0 z-10">
        <Image
          src="/assets/faq.png"
          alt=""
          width={1900}
          height={129}
          className=" h-32  opacity-90"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-[40px] font-[900] text-[#252650] mb-4">
            FAQ
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="bg-white">
          {faqItems.map((item, index) => (
            <div key={index}>
              {/* Question Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full cursor-pointer px-0 py-6 lg:py-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
              >
                <h3 className="text-base lg:text-xl font-bold text-[#252650] pr-4">
                  {item.question}
                </h3>

                {/* Plus/Minus Icon */}
                <div className="flex-shrink-0">
                  <div
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      borderColor: openIndex === index ? "#F9AE15" : "#E5E7EB",
                      color: openIndex === index ? "#F9AE15" : "transparent",
                    }}
                  >
                    {openIndex === index ? (
                      <Minus size={16} className="lg:w-5 lg:h-5 " />
                    ) : (
                      <Plus size={16} className="lg:w-5 lg:h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Answer Content */}
              {openIndex === index && (
                <div className="pb-6 lg:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-sm lg:text-base font-medium text-[#515151]">
                    {item.answer}
                  </p>
                </div>
              )}

              {/* Divider Line - Don't show after last item */}
              {index < faqItems.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
