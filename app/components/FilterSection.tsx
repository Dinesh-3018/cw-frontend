/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import SearchIcon from "../assets/SearchIcon.svg";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LocationIcon from "../assets/LocationIcon.svg";
import JobTypeIcon from "../assets/UserIcon.svg";
import DropDownIcon from "../assets/Vector.svg";
import { FiMapPin, FiBriefcase } from "react-icons/fi";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import axios from "axios";
import PriceRangeSlider from "./SalaryRangeSlider";
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

interface FilterSectionProps {
  setJobs: (jobs: any[]) => void;
  setLoading: (loading: boolean) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  setJobs,
  setLoading,
}) => {
  const locations: OptionType[] = useMemo(
    () => [
      { id: "preferred", name: "Preferred Location", icon: FiMapPin },
      { id: "chennai", name: "Chennai", icon: FiMapPin },
      { id: "bangalore", name: "Bangalore", icon: FiMapPin },
      { id: "hyderabad", name: "Hyderabad", icon: FiMapPin },
      { id: "coimbatore", name: "Coimbatore", icon: FiMapPin },
    ],
    []
  );

  const jobTypes: OptionType[] = useMemo(
    () => [
      { id: "any", name: "Any Job Type", icon: FiBriefcase },
      { id: "FULL_TIME", name: "Full-time", icon: FiBriefcase },
      { id: "PART_TIME", name: "Part-time", icon: FiBriefcase },
      { id: "INTERNSHIP", name: "Internship", icon: FiBriefcase },
    ],
    []
  );

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<OptionType>(
    locations[0]
  );
  const [Filters, setFilters] = useState<JobData>({});
  const [selectedJobType, setSelectedJobType] = useState<OptionType>(
    jobTypes[0]
  );
  console.log(Filters);

  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const jobTypeDropdownRef = useRef<HTMLDivElement>(null);

  const wrapperVariants = useMemo(
    () => ({
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
    }),
    []
  );

  const iconVariants = useMemo(
    () => ({
      open: { rotate: 180 },
      closed: { rotate: 0 },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      open: {
        opacity: 1,
        y: 0,
        transition: { when: "beforeChildren" },
      },
      closed: {
        opacity: 0,
        y: -15,
        transition: { when: "afterChildren" },
      },
    }),
    []
  );
  const fetchJobs = useCallback(
    async (newFilters: JobData) => {
      setLoading(true);
      try {
        setJobs([]);

        setFilters((prevFilters) => {
          const mergedFilters = { ...prevFilters, ...newFilters };

          axios
            .get("https://cw-backend-25rn.onrender.com/jobs", {
              params: mergedFilters,
            })
            .then((response) => {
              setJobs(response.data?.data || []);
            })
            .catch((error) => {
              console.error("Error fetching jobs:", error);
            })
            .finally(() => {
              setLoading(false);
            });

          return mergedFilters;
        });
      } catch (error) {
        console.error("Unexpected error:", error);
        setLoading(false);
      }
    },
    [setJobs, setLoading, setFilters]
  );

  const toggleLocationDropdown = useCallback(() => {
    setIsLocationOpen((prev) => !prev);
    if (isJobTypeOpen) setIsJobTypeOpen(false);
  }, [isJobTypeOpen]);

  const toggleJobTypeDropdown = useCallback(() => {
    setIsJobTypeOpen((prev) => !prev);
    if (isLocationOpen) setIsLocationOpen(false);
  }, [isLocationOpen]);

  const selectLocation = useCallback(
    (location: OptionType) => {
      const filters =
        location.id === "preferred" ? {} : { location: location.name };
      fetchJobs(filters);
      setSelectedLocation(location);
      setIsLocationOpen(false);
    },
    [fetchJobs]
  );

  const selectJobType = useCallback(
    (jobType: OptionType) => {
      const filters = jobType.id === "any" ? {} : { jobType: jobType.name };
      fetchJobs(filters);
      setSelectedJobType(jobType);
      setIsJobTypeOpen(false);
    },
    [fetchJobs]
  );

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      fetchJobs({ title: searchQuery });
    }
  }, [searchQuery, fetchJobs]);

  const handleSalaryChange = useCallback(
    (values: [number, number]) => {
      const [minSalary, maxSalary] = values;
      fetchJobs({ salary_range: `${minSalary}-${maxSalary}` });
    },
    [fetchJobs]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
      if (
        jobTypeDropdownRef.current &&
        !jobTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsJobTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="shadow-sm">
      <div className="bg-white h-[80px] xl:flex flex-row justify-center max-w-screen-xl mx-auto w-full border-white/10">
        <div className="xl:flex xl:flex-row items-center lg:flex-col gap-x-4 w-full">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-16 border-r-2 border-gray-300 font-[SatoshiMedium] text-[#222222] text-xl focus:outline-none placeholder:text-[#686868] placeholder:font-[SatoshiMedium]"
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
                  initial={wrapperVariants.closed}
                  animate={wrapperVariants.open}
                  variants={wrapperVariants}
                  className="absolute z-10 w-[95%] mt-1 ml-4 bg-white rounded-md shadow-lg"
                  style={{ originY: "top" }}
                >
                  <ul className="py-1">
                    {locations.map((location) => (
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
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          <div ref={jobTypeDropdownRef}>
            <div className="relative xl:w-72 w-full">
              <button
                type="button"
                onClick={toggleJobTypeDropdown}
                className="flex items-center justify-between w-full px-4 py-4 pr-10 text-gray-600 bg-white border-r-2 border-gray-300 focus:outline-none"
              >
                <div className="flex items-center">
                  <Image src={JobTypeIcon} alt="JobTypeIcon" className="ml-3" />
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
                  animate={wrapperVariants.open}
                  variants={wrapperVariants}
                  className="absolute z-10 w-[95%] mt-1 ml-4 bg-white rounded-md shadow-lg"
                  style={{ originY: "top" }}
                >
                  <ul className="py-1">
                    {jobTypes.map((jobType) => (
                      <motion.li
                        key={jobType.id}
                        variants={itemVariants}
                        onClick={() => selectJobType(jobType)}
                        className="flex items-center px-4 py-2 text-lg hover:bg-gray-100 cursor-pointer font-[SatoshiMedium] text-[#686868]"
                      >
                        {jobType.icon && (
                          <jobType.icon className="mr-2" size={16} />
                        )}
                        {jobType.name}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          <div className="xl:ml-10 m-10 xl:m-0">
            <PriceRangeSlider fetchJobs={fetchJobs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FilterSection);
