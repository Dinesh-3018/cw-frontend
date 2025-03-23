/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import SearchIcon from "../assets/SearchIcon.svg";
import React, { useEffect, useRef, useState } from "react";
import LocationIcon from "../assets/LocationIcon.svg";
import JobTypeIcon from "../assets/UserIcon.svg";
import DropDownIcon from "../assets/Vector.svg";
import { FiMapPin, FiBriefcase } from "react-icons/fi";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import SalaryRangeSlider from "./SalaryRangeSlider";
import axios from "axios";

interface OptionType {
  id: string;
  name: string;
  icon?: IconType;
}
interface JobData {
  title?: string;
  location?: string;
  jobType?: string;
  minSalary?: number;
  maxSalary?: number;
  salary_range?: string;
}

const FilterSection = ({ setJobs, setLoading }: any) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [SearchQuery, SetSearchQuery] = useState("");
  const locationDropdownRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState<OptionType>({
    id: "preferred",
    name: "Preferred Location",
    icon: FiMapPin,
  });
  console.log("Selected Location:", selectedLocation);

  const fetchJobs = async (filters: JobData) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${"https://cw-backend-25rn.onrender.com"}/jobs`,
        { params: filters }
      );
      setJobs(response.data?.data);
      console.log("Jobs fetched:", response.data?.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const jobTypeDropdownRef = useRef(null);
  const [selectedJobType, setSelectedJobType] = useState<OptionType>({
    id: "any",
    name: "Any Job Type",
    icon: FiBriefcase,
  });

  const locations: OptionType[] = [
    { id: "preferred", name: "Preferred Location", icon: FiMapPin },
    { id: "chennai", name: "Chennai", icon: FiMapPin },
    { id: "bangalore", name: "Bangalore", icon: FiMapPin },
    { id: "hyderabad", name: "Hyderabad", icon: FiMapPin },
    { id: "coimbatore", name: "Coimbatore", icon: FiMapPin },
  ];

  const jobTypes: OptionType[] = [
    { id: "any", name: "Any Job Type", icon: FiBriefcase },
    { id: "FULL_TIME", name: "Full-time", icon: FiBriefcase },
    { id: "PART_TIME", name: "Part-time", icon: FiBriefcase },
    { id: "INTERNSHIP", name: "Internship", icon: FiBriefcase },
  ];

  const toggleLocationDropdown = () => {
    setIsLocationOpen(!isLocationOpen);
    if (isJobTypeOpen) setIsJobTypeOpen(false);
  };

  const selectLocation = (location: OptionType) => {
    if (location.id === "preferred") {
      fetchJobs({});
    } else {
      fetchJobs({ location: location.name });
    }
    setSelectedLocation(location);
    setIsLocationOpen(false);
  };

  const selectJobType = (jobType: OptionType) => {
    const JOB_TYPE_MAP: Record<string, string> = {
      "Full-time": "Full Time",
      "Part-time": "Part Time",
      Contract: "Contract",
      Internship: "Internship",
    };

    const formattedJobType = JOB_TYPE_MAP[jobType.name] || jobType.name;

    if (jobType.id === "any") {
      fetchJobs({});
    } else {
      fetchJobs({ jobType: formattedJobType });
    }

    setSelectedJobType(jobType);
    setIsJobTypeOpen(false);
  };

  const toggleJobTypeDropdown = () => {
    setIsJobTypeOpen(!isJobTypeOpen);
    if (isLocationOpen) setIsLocationOpen(false);
  };
  const wrapperVariants = {
    open: {
      scaleY: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    closed: {
      scaleY: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
      },
    },
    closed: {
      opacity: 0,
      y: -15,
      transition: {
        when: "afterChildren",
      },
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current) {
        setIsLocationOpen(false);
      }
      if (jobTypeDropdownRef.current) {
        setIsJobTypeOpen(false);
      }
    };

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLocationOpen, isJobTypeOpen]);
  const handleSalaryChange = (values: [number, number]) => {
    const [minSalary, maxSalary] = values;
    fetchJobs({ salary_range: `${minSalary}-${maxSalary}` });
  };

  return (
    <>
      <div className=" shadow-sm">
        <div className="bg-white  h-[80px] xl:flex flex-row justify-center max-w-screen-xl mx-auto  w-full border-white/10">
          <div className="">
            <div className="xl:flex xl:flex-row items-center  lg:flex-col gap-x-4 w-full ">
              <div className="relative ">
                <input
                  type="text"
                  value={SearchQuery}
                  onKeyDown={(e) =>
                    e.key === "Enter" && fetchJobs({ title: SearchQuery })
                  }
                  onChange={(e) => SetSearchQuery(e.target.value)}
                  className="w-full h-14 pl-16  border-r-2 border-gray-300 font-[SatoshiMedium] text-[#222222]  text-xl focus:outline-none placeholder:text-[#686868] placeholder:font-[SatoshiMedium]"
                  placeholder="Search By Job Title, Role"
                />
                <Image
                  src={SearchIcon}
                  alt="Search Icon"
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6"
                />
              </div>
              <div ref={locationDropdownRef}>
                <div className="relative xl:w-80 sm:w-full">
                  <button
                    type="button"
                    onClick={toggleLocationDropdown}
                    className="flex items-center justify-between w-full px-4 py-4 pr-10 text-gray-600 bg-white border-r-2 border-gray-300 focus:outline-none"
                  >
                    <div className="flex items-center">
                      <Image
                        src={LocationIcon}
                        alt="LocationIcon"
                        className="ml-3"
                      />
                      <span className="text-[#686868] font-[SatoshiMedium] text-xl pl-4">
                        {selectedLocation?.name}
                      </span>
                    </div>
                    <motion.div
                      animate={isLocationOpen ? "open" : "closed"}
                      variants={iconVariants}
                      className="mt-2 ml-5"
                    >
                      <Image src={DropDownIcon} alt="DropIcon" />
                    </motion.div>
                  </button>

                  {isLocationOpen && (
                    <motion.div
                      onClick={() => console.log("Hello")}
                      initial={wrapperVariants.closed}
                      animate={wrapperVariants.open}
                      variants={wrapperVariants}
                      className="absolute z-10 w-[95%] mt-1 ml-4 bg-white rounded-md shadow-lg"
                      style={{ originY: "top" }}
                    >
                      <ul className="py-1">
                        {locations?.length > 0 ? (
                          locations.map((location) => (
                            <motion.li
                              key={location.id}
                              variants={itemVariants}
                              onClick={() => selectLocation(location)}
                              className="flex items-center px-4 py-2 text-lg z-50 hover:bg-gray-100 cursor-pointer font-[SatoshiMedium] text-[#686868]"
                            >
                              {location.icon &&
                                React.createElement(location.icon, {
                                  className: "mr-2",
                                  size: 16,
                                })}
                              {location.name}
                            </motion.li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-500">
                            No locations found
                          </li>
                        )}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>
              {/* <div ref={locationDropdownRef}>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={toggleLocationDropdown}
                    className="flex items-center justify-between w-full px-4 py-4 pr-10 text-gray-600 bg-white border-r-2 border-gray-300 focus:outline-none"
                  >
                    <div className="flex items-center">
                      <Image
                        src={LocationIcon}
                        alt="LocationIcon"
                        className="ml-3"
                      />
                      <span className="text-[#686868] font-[SatoshiMedium] text-xl pl-4">
                        {selectedLocation?.name}
                      </span>
                    </div>
                    <motion.div
                      animate={isLocationOpen ? "open" : "closed"}
                      variants={iconVariants}
                      className="mt-2 ml-5"
                    >
                      <Image src={DropDownIcon} alt="DropIcon" />
                    </motion.div>
                  </button>

                  {isLocationOpen && (
                    <motion.div
                      initial={wrapperVariants.closed}
                      animate="open"
                      variants={wrapperVariants}
                      className="absolute z-10 w-[95%] mt-1 ml-4 bg-white rounded-md shadow-lg"
                      style={{ originY: "top" }}
                    >
                      <ul className="py-1">
                        {locations.map((location) => (
                          <motion.li
                            key={location.id}
                            variants={itemVariants}
                            onClick={() => console.log("Hello")}
                            onKeyDown={() => console.log("Hello")}
                            className="flex items-center px-4 py-2 text-lg hover:bg-gray-100 cursor-pointer font-[SatoshiMedium] text-[#686868]"
                          >
                            {location.icon && (
                              <location.icon className="mr-2" size={16} />
                            )}
                            {location.name}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div> */}
              <div ref={jobTypeDropdownRef}>
                <div className="relative xl:w-72 w-full">
                  <button
                    type="button"
                    onClick={toggleJobTypeDropdown}
                    className="flex items-center justify-between w-full px-4 py-4 pr-10 text-gray-600 bg-white border-r-2 border-gray-300 focus:outline-none"
                  >
                    <div className="flex items-center">
                      <Image
                        src={JobTypeIcon}
                        alt="LocationIcon"
                        className="ml-3"
                      />
                      <span className="text-[#686868] font-[SatoshiMedium] text-xl pl-4">
                        {selectedJobType?.name}
                      </span>
                    </div>
                    <motion.div
                      animate={isJobTypeOpen ? "open" : "closed"}
                      variants={iconVariants}
                      className="mt-2 ml-6"
                    >
                      <Image src={DropDownIcon} alt="DropIcon" />
                    </motion.div>
                  </button>

                  {isJobTypeOpen && (
                    <motion.div
                      initial={wrapperVariants.closed}
                      animate="open"
                      variants={wrapperVariants}
                      className="absolute z-10 w-[95%] mt-1 ml-4 bg-white rounded-md shadow-lg"
                      style={{ originY: "top" }}
                    >
                      <ul className="py-1">
                        {jobTypes.map((location) => (
                          <motion.li
                            key={location.id}
                            variants={itemVariants}
                            onClick={() => {
                              selectJobType(location);
                            }}
                            className="flex items-center px-4 py-2 text-lg hover:bg-gray-100 cursor-pointer font-[SatoshiMedium] text-[#686868]"
                          >
                            {location.icon && (
                              <location.icon className="mr-2" size={16} />
                            )}
                            {location.name}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="xl:ml-10 m-10  xl:m-0">
                <SalaryRangeSlider
                  minValue={10000}
                  maxValue={200000}
                  step={5000}
                  initialValues={[50000, 80000]}
                  onChange={handleSalaryChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSection;
