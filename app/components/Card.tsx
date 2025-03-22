/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";

import ExprienceIcon from "../assets/UserPlus.svg";
import OfcIcon from "../assets/OfficeIcon.svg";
import StackIcon from "../assets/PackageIcon.svg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import SampleCompanyLogo2 from "../assets/SampleIcon2.svg";
import SampleCompanyLogo3 from "../assets/SampleIcon3.svg";
import SampleCompanyLogo from "../assets/SampleCompanyLogo.svg";
enum JobType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  INTERNSHIP = "Internship",
  FREELANCE = "Freelance",
  ANY = "Any Job Type",
}

interface Job {
  company_name: string;
  job_title?: string;
  job_description?: string;
  job_type?: JobType;
  salary_range?: string;
  created_at?: string;
}

const Card = ({ job }: { job: Job }) => {
  const parseSalaryLPA = (range: string) => {
    try {
      const numbers = range.split("-").map(Number);
      const avgSalary = numbers.reduce((a, b) => a + b, 0) / numbers.length;
      return `${Math.round(avgSalary / 1000)} LPA`;
    } catch (error) {
      return "N/A LPA";
    }
  };
  const sampleLogos = [
    SampleCompanyLogo,
    SampleCompanyLogo2,
    SampleCompanyLogo3,
  ];

  const getRandomLogo = (companyName: string) => {
    const index =
      companyName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      sampleLogos.length;
    return sampleLogos[index];
  };
  const getExperienceYears = (jobType: JobType | undefined) => {
    if (!jobType) return "N/A";

    switch (jobType) {
      case JobType.FULL_TIME:
        return "3-7 yr Exp";
      case JobType.PART_TIME:
        return "1-3 yr Exp";
      case JobType.CONTRACT:
        return "2-5 yr Exp";
      case JobType.INTERNSHIP:
        return "0-1 yr Exp";
      default:
        return "N/A";
    }
  };

  const formatDescription = (description: string) => {
    if (!description) return ["", ""];

    const words = description.split(" ");

    if (words.length <= 10) {
      return [description, ""];
    }

    const firstPart = words.slice(0, Math.ceil(words.length / 2)).join(" ");
    const secondPart = words.slice(Math.ceil(words.length / 2)).join(" ");

    return [
      firstPart.length > 60 ? `${firstPart.substring(0, 60)}...` : firstPart,
      secondPart.length > 60 ? `${secondPart.substring(0, 60)}...` : secondPart,
    ];
  };

  const [point1, point2] = formatDescription(job?.job_description || "");

  dayjs.extend(relativeTime);

  return (
    <div>
      <div className="w-[350px] h-[370px] border border-white/10 shadow-lg rounded-2xl flex flex-col">
        {/* Top section with logo and time */}
        <div className="m-3 mt-4">
          <div className="flex flex-row justify-between items-start">
            <div className="w-[83px] h-[82px] p-2 border rounded-xl border-white shadow-sm">
              <Image
                src={getRandomLogo(job?.company_name)}
                alt="Company Logo"
              />
            </div>
            <div>
              <div className="bg-[#B0D9FF] rounded-xl text-center px-3 py-1.5">
                <h1 className="text-[#000000] font-[SatoshiMedium] capitalize">
                  {job?.created_at ? dayjs(job.created_at).fromNow() : "Recent"}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Job title and details */}
        <div className="ml-4 mt-1">
          <div>
            <h1 className="text-[#000000] font-[SatoshiSemiBold] text-xl">
              {job?.job_title || "Full Stack Developer"}
            </h1>
          </div>
          <div className="mt-3">
            <div className="flex flex-row items-center justify-between mr-5">
              <div className="flex flex-row items-center gap-x-2">
                <Image src={ExprienceIcon} alt="Experience Icon" />
                <h1 className="text-[#5A5A5A] font-[SatoshiMedium]">
                  {getExperienceYears(job?.job_type)}
                </h1>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <Image src={OfcIcon} alt="Office Icon" />
                <h1 className="text-[#5A5A5A] font-[SatoshiMedium]">
                  {job?.job_type || "Onsite"}
                </h1>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <Image src={StackIcon} alt="Salary Icon" />
                <h1 className="text-[#5A5A5A] font-[SatoshiMedium]">
                  {parseSalaryLPA(job?.salary_range || "0")}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Description section */}
        <div className="ml-2 mr-3 mt-4 flex-grow overflow-hidden">
          <div className="text-[#555555] font-[SatoshiMedium]">
            <ul className="list-disc pl-5">
              {point1 && (
                <li className="break-words whitespace-pre-line">{point1}</li>
              )}
              {point2 && (
                <li className="break-words whitespace-pre-line mt-2">
                  {point2}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="px-4 mt-auto mb-4">
          <button className="bg-[#00AAFF] w-full cursor-pointer border border-[#00AAFF] rounded-xl text-white text-center px-6 py-3 font-[SatoshiSemiBold] text-md">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
