import React, { useState } from "react";
import Image from "next/image";
import ApplicationModal from "./ApplicationModal";

interface JobDetailsProps {
  jobTitle: string;
  onBack: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ jobTitle, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Job data for different positions
  const jobData = {
    "Nursery Manager": {
      description:
        "We are seeking an experienced, motivated, and passionate Nursery Manager to lead our team and oversee the day-to-day running of Spring Lane Nursery. The successful candidate will ensure that the highest standards of care, education, compliance, and leadership are consistently maintained throughout the setting. This role requires someone who can take initiative, develop strong foundations for best practice, and help shape the nursery's ethos, values, and long-term vision as we grow.",
      salary: "£34,000 - £42,000 per annum",
      location: "Spring Lane Nursery, South Norwood, London",
      type: "Full Time",
      contract: "Permanent, Full-Time (40 hours per week)",
      startDate: "ASAP",
      aboutCompany:
        "Spring Lane Nursery is a vibrant and inclusive early years setting in the heart of South Norwood, London. We are committed to delivering high-quality childcare and education to children aged 0 to 5 years. Our mission is to create a nurturing, safe, and inspiring environment where every child can thrive, explore, and develop a lifelong love for learning. We are a small, homely nursery with a total capacity of around 20 children, allowing for a warm, personal approach to care and education.",
      keyResponsibilities: [
        "Lead, support and manage the nursery team to deliver outstanding early years care and education",
        "Conduct regular supervision, appraisals and team meetings",
        "Develop and implement staff rotas, training plans, and ongoing CPD",
        "Create a positive, collaborative, and professional working culture",
        "Oversee the smooth running of all nursery rooms and daily routines",
        "Ensure compliance with the EYFS, Ofsted standards, health and safety, and safeguarding policies",
        "Complete and maintain accurate records including attendance, accidents, assessments, and audits",
        "Prepare for and lead Ofsted inspections confidently and competently",
        "Monitor and support children's progress through effective observation, assessment, and planning",
        "Promote inclusive practice and ensure that individual needs are met",
        "Work with SENCO and external professionals where necessary to support children with additional needs",
        "Build strong relationships with parents and carers, ensuring excellent communication at all times",
        "Handle feedback, complaints, and concerns professionally and promptly",
        "Organise parent events, open days, and community partnerships",
        "Manage nursery budgets, invoicing, occupancy, and fee collection",
        "Support marketing, advertising, and enrolment of new children",
        "Ensure all administrative and legal documents are up to date and compliant",
      ],
      requirements: [
        "Level 3 or above qualification in Childcare and Education (e.g. NVQ, CACHE, or equivalent)",
        "Experience working in a new or start-up nursery setting, with the ability to build team culture and lead development",
        "At least 2 years' experience in a senior leadership role within an early years setting",
        "In-depth knowledge of the EYFS, safeguarding, Ofsted requirements, and child development",
        "Strong leadership, interpersonal, organisational, and communication skills",
        "DBS clearance and eligibility to work in the UK",
      ],
      desirableRequirements: [
        "Level 5 or above in Leadership for the Children and Young People's Workforce or similar",
        "Designated Safeguarding Lead (DSL) training",
        "SENCO trained or experience supporting children with special educational needs",
        "Paediatric First Aid certificate",
        "Experience using nursery management software (e.g. Famly, Tapestry)",
      ],
      whatWeOffer: [
        "Competitive salary package (£34,000 - £42,000 depending on experience and qualifications)",
        "Performance bonus awarded upon successful Ofsted inspection graded Good or Outstanding",
        "28 days holiday including bank holidays (increasing with length of service)",
        "Pension scheme",
        "Ongoing training and professional development opportunities",
        "Staff childcare discount",
        "Opportunities to grow with a thriving and expanding setting",
        "Small, homely environment allowing for meaningful relationships with staff and families",
      ],
      email: "ah.polock23@gmail.com", // You may want to update this with the actual application email
      deadline: "Open until filled",
    },
    "Nursery Assistant": {
      description:
        "We are looking for warm, friendly and enthusiastic Nursery Assistants to join our team. You will play a vital role in supporting the children's development and wellbeing, assisting with daily routines, and creating a positive and fun environment. This is a great opportunity for someone who is passionate about working with young children and wants to grow their career in early years education.",
      salary: "£21,000 - £24,000 per annum",
      location: "Spring Lane Nursery, South Norwood, London",
      type: "Full Time",
      contract: "Permanent, Full-Time (40 hours per week)",
      startDate: "ASAP",
      aboutCompany:
        "Spring Lane Nursery is a vibrant and inclusive early years setting in the heart of South Norwood, London. We are committed to delivering high-quality childcare and education to children aged 0 to 5 years. Our mission is to create a nurturing, safe, and inspiring environment where every child can thrive, explore, and develop a lifelong love for learning. We are a small, homely nursery with a total capacity of around 20 children. Our small team works closely together to provide individualised care and form strong, trusting relationships with children and their families.",
      keyResponsibilities: [
        "Support children's learning and development through play-based activities",
        "Encourage positive behaviour and help promote children's social and emotional wellbeing",
        "Assist with planning and setting up engaging, age-appropriate activities",
        "Work as a key person to a small group of children (if qualified)",
        "Support with meal times, nappy changes, toileting, and personal hygiene routines",
        "Ensure the environment is clean, safe, and welcoming at all times",
        "Follow all safeguarding, health and safety, and nursery policies",
        "Work closely with other staff as part of a supportive team",
        "Communicate effectively with children, colleagues and parents",
        "Attend staff meetings, training sessions and contribute to nursery events",
      ],
      requirements: [
        "A genuine passion for working with young children",
        "Friendly, approachable, and reliable",
        "Willingness to learn and follow guidance",
        "Ability to work as part of a team and use initiative",
        "DBS clearance and eligibility to work in the UK",
      ],
      desirableRequirements: [
        "Level 2 or 3 qualification in Childcare and Education",
        "Experience working in a nursery or early years setting",
        "Paediatric First Aid certificate",
      ],
      whatWeOffer: [
        "Competitive salary package (£21,000 - £24,000 depending on qualifications and experience)",
        "28 days holiday including bank holidays (increasing with length of service)",
        "Pension scheme",
        "Ongoing training and professional development opportunities",
        "Staff childcare discount",
        "Supportive team and positive working environment",
        "Small, close-knit team environment with individualised care approach",
        "Opportunities to work as a key person to a small group of children",
      ],
      email: "ah.polock23@gmail.com", // You may want to update this with the actual application email
      deadline: "Rolling applications - early applications encouraged",
    },
    "Early Years Teacher": {
      description:
        "We are looking for an enthusiastic and qualified Early Years Teacher to join our team and lead the implementation of the Early Years Foundation Stage (EYFS). You will plan and deliver high-quality learning experiences, prepare children for their transition to school, and ensure all children receive the best possible start in life.",
      salary: "£27,000 - £33,000 per annum",
      location: "Spring Lane Nursery, South Norwood, London",
      type: "Full Time",
      contract: "Permanent, Full-Time (40 hours per week)",
      startDate: "ASAP",
      aboutCompany:
        "Spring Lane Nursery is a welcoming and inclusive early years setting based in South Norwood, London. We provide high-quality care and education for children aged 0–5 years. Our small setting allows for personalised attention, strong relationships, and a nurturing learning environment where every child can thrive.",
      keyResponsibilities: [
        "Plan and deliver engaging, age-appropriate learning opportunities in line with the EYFS",
        "Support children's development across all areas of learning, ensuring progress is observed and assessed effectively",
        "Promote a nurturing, stimulating and safe learning environment",
        "Work in partnership with parents and carers, sharing regular updates and supporting each child's individual journey",
        "Lead by example and support colleagues with EYFS knowledge, planning and practice",
        "Help prepare children for school through focused learning activities, independence building and positive routines",
        "Maintain accurate records, learning journals, and assessments for each child",
        "Ensure compliance with safeguarding, health and safety, and all nursery policies",
      ],
      requirements: [
        "Early Years Teacher Status (EYTS) or Qualified Teacher Status (QTS)",
        "Strong understanding of the EYFS and early childhood development",
        "Experience working with children in an early years or preschool setting",
        "Excellent communication and organisational skills",
        "A passion for supporting children to reach their full potential",
        "DBS clearance and eligibility to work in the UK",
      ],
      desirableRequirements: [
        "Experience leading a preschool room or early years team",
        "SENCO training or experience supporting children with additional needs",
        "Paediatric First Aid certificate",
        "Experience using online learning journals and assessment tools",
      ],
      whatWeOffer: [
        "Competitive salary package (£27,000 - £33,000 depending on experience and qualifications)",
        "28 days holiday including bank holidays (increasing with length of service)",
        "Pension scheme",
        "Ongoing training and professional development opportunities",
        "Staff childcare discount",
        "Supportive and inclusive team culture",
        "Opportunities to grow and shape practice in a small, creative setting",
        "Small setting allowing for personalised attention and strong relationships",
      ],
      email: "ah.polock23@gmail.com", // You may want to update this with the actual application email
      deadline: "Rolling applications - early applications encouraged",
    },
    "Room Leader": {
      description:
        "We are looking for an enthusiastic and experienced Room Leader to join our dedicated team. The Room Leader will take responsibility for leading the day-to-day running of a room, ensuring a high standard of care, education and wellbeing for all children. This is a great opportunity for someone who is passionate about early years education and enjoys working in a small, close-knit team.",
      salary: "£24,000 - £28,000 per annum",
      location: "Spring Lane Nursery, South Norwood, London",
      type: "Full Time",
      contract: "Permanent, Full-Time (40 hours per week)",
      startDate: "ASAP",
      aboutCompany:
        "Spring Lane Nursery is a vibrant and inclusive early years setting in the heart of South Norwood, London. We are committed to delivering high-quality childcare and education to children aged 0 to 5 years. Our mission is to create a nurturing, safe, and inspiring environment where every child can thrive, explore, and develop a lifelong love for learning. We are a small, homely nursery with a total capacity of around 20 children, allowing for a warm, personal approach to care and education. Our size enables our team to form strong bonds with children and families, and work closely together in a friendly and supportive environment.",
      keyResponsibilities: [
        "Lead the room's daily activities and routines to deliver engaging and age-appropriate experiences",
        "Act as a key person to a small group of children, building strong, positive relationships with families",
        "Ensure that the EYFS is delivered effectively, and that planning, observation, and assessments are up to date",
        "Provide guidance and support to other staff within the room",
        "Maintain a safe, clean, and stimulating environment at all times",
        "Ensure all safeguarding procedures are followed and report any concerns appropriately",
        "Complete accident/incident reports and maintain accurate records",
        "Support each child's development through play and learning activities",
        "Promote children's physical and emotional wellbeing",
        "Work with parents and carers to support each child's individual needs",
        "Communicate effectively with colleagues, management, and families",
        "Contribute to staff meetings, planning, and nursery events",
        "Support the overall ethos and values of Spring Lane Nursery",
      ],
      requirements: [
        "Level 3 qualification in Childcare and Education (e.g. NVQ, CACHE, or equivalent)",
        "Experience working in an early years setting",
        "Good understanding of the EYFS, safeguarding and health and safety requirements",
        "Warm, caring and positive attitude with excellent communication skills",
        "DBS clearance and eligibility to work in the UK",
      ],
      desirableRequirements: [
        "Experience as a Room Leader or Senior Practitioner",
        "Paediatric First Aid certificate",
        "Designated Safeguarding Lead (DSL) training",
      ],
      whatWeOffer: [
        "Competitive salary package (£24,000 - £28,000 depending on qualifications and experience)",
        "28 days holiday including bank holidays (increasing with length of service)",
        "Pension scheme",
        "Ongoing training and professional development opportunities",
        "Staff childcare discount",
        "Opportunity to grow within a warm and supportive team",
        "Small, homely nursery environment with strong bonds",
        "Close-knit team working in a friendly and supportive environment",
      ],
      email: "ah.polock23@gmail.com", // You may want to update this with the actual application email
      deadline: "Rolling applications - early applications encouraged",
    },
  };

  const job = jobData[jobTitle as keyof typeof jobData];

  if (!job) return null;

  return (
    <div className="bg-white">
      {/* Full Width Image */}
      <div className="max-w-[1280] mx-auto relative">
        <Image
          src="/assets/careers-details-image.png"
          alt={`${jobTitle} position`}
          width={1280}
          height={624}
          className="object-cover w-full h-full"
          priority
        />
        {/* Back button overlay */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 cursor-pointer bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[#252650] hover:bg-white transition-all duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Careers</span>
        </button>
      </div>

      {/* Job Details Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#2C97A9]">
                We&apos;re hiring!
              </h2>
              <p className="text-lg text-[#252650] leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* About Spring Lane Nursery */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#252650]">
                About Spring Lane Nursery:
              </h3>
              <p className="text-base text-[#252650] leading-relaxed">
                {job.aboutCompany}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#252650]">
                Key Responsibilities:
              </h3>
              <ul className="space-y-2">
                {job.keyResponsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#252650] rounded-full mt-2.5 flex-shrink-0"></span>
                    <span className="text-base text-[#252650] leading-relaxed">
                      {responsibility}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Essential Requirements */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#252650]">
                Essential Requirements:
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#252650] rounded-full mt-2.5 flex-shrink-0"></span>
                    <span className="text-base text-[#252650] leading-relaxed">
                      {requirement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desirable Requirements */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#252650]">
                Desirable Requirements:
              </h3>
              <ul className="space-y-2">
                {job.desirableRequirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#2C97A9] rounded-full mt-2.5 flex-shrink-0"></span>
                    <span className="text-base text-[#252650] leading-relaxed">
                      {requirement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Offer */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#252650]">
                What We Offer:
              </h3>
              <ul className="space-y-2">
                {job.whatWeOffer.map((offer, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#252650] rounded-full mt-2.5 flex-shrink-0"></span>
                    <span className="text-base text-[#252650] leading-relaxed">
                      {offer}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Call to Action */}
            <div className="space-y-4 pt-6">
              <p className="text-base text-[#252650] leading-relaxed flex items-start space-x-2">
                <span className="w-5 h-5 flex-shrink-0 ">🌟</span>
                <span>
                  Spring Lane Nursery is committed to safeguarding and promoting
                  the welfare of children. All appointments are subject to
                  enhanced DBS checks and references. We are an equal
                  opportunities employer.
                </span>
              </p>
              <p className="text-base text-[#252650] leading-relaxed flex items-start space-x-2">
                <span className="w-5 h-5 flex-shrink-0 ">📧</span>
                <span>
                  Apply now by sending your CV and cover letter to {job.email}
                </span>
              </p>
              <p className="text-base text-[#252650] leading-relaxed flex items-start space-x-3">
                <span className="w-5 h-5 flex-shrink-0 ">📅</span>
                <span>Start Date: {job.startDate}</span>
              </p>
            </div>
          </div>

          {/* Sidebar - Apply Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#252650] rounded-2xl p-6 text-white sticky top-8">
              <h3 className="text-xl font-semibold mb-6">Apply for the job</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5">
                    <Image
                      src="/assets/fulltime-icon-d.svg"
                      alt="Full time"
                      width={20}
                      height={20}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <span>{job.type}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5">
                    <Image
                      src="/assets/location-icon-d.svg"
                      alt="Location"
                      width={20}
                      height={20}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5">
                    <Image
                      src="/assets/salary-icon.svg"
                      alt="Salary"
                      width={20}
                      height={20}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <span>{job.salary}</span>
                </div>
              </div>

              <button
                className="w-full bg-white cursor-pointer text-[#252650] py-3 px-6 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setIsModalOpen(true)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={jobTitle}
      />
    </div>
  );
};

export default JobDetails;
