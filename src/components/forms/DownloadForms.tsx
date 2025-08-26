import React from "react";

const DownloadForms = () => {
  const forms = [
    {
      title: "Registration Form",
      description:
        "Our philosophy is simple — hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.",
      buttonBg: "#FC4C17",
      cardBg: "#FC4C171A",
      titleColor: "#FC4C17",
    },
    {
      title: "Medical Information",
      description:
        "Our philosophy is simple — hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.",
      buttonBg: "#2C97A9",
      cardBg: "#2C97A91A",
      titleColor: "#2C97A9",
    },
    {
      title: "Funding Application",
      description:
        "Our philosophy is simple — hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.",
      buttonBg: "#F6353B",
      cardBg: "#F6353B1A",
      titleColor: "#F6353B",
    },
    {
      title: "Emergency Contacts",
      description:
        "Our philosophy is simple — hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.",
      buttonBg: "#2AA631",
      cardBg: "#2AA6311A",
      titleColor: "#2AA631",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Desktop Layout */}
      <div className="hidden md:block md:space-y-6">
        {forms.map((form, index) => (
          <div
            key={index}
            className="rounded-2xl p-6 flex items-center justify-between"
            style={{ backgroundColor: form.cardBg }}
          >
            <div className="flex-1 pr-6">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: form.titleColor }}
              >
                {form.title}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#252650" }}
              >
                {form.description}
              </p>
            </div>
            <button
              className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-opacity hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: form.buttonBg }}
            >
              Download
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15V3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-6">
        {forms.map((form, index) => (
          <div
            key={index}
            className="rounded-2xl p-6"
            style={{ backgroundColor: form.cardBg }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: form.titleColor }}
            >
              {form.title}
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "#252650" }}
            >
              {form.description}
            </p>
            <button
              className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: form.buttonBg }}
            >
              Download
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15V3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadForms;
