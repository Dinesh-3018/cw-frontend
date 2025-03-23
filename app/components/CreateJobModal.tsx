/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMapPin, FiBriefcase } from "react-icons/fi";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import LocationIcon from "../assets/LocationIcon.svg";
import JobTypeIcon from "../assets/UserIcon.svg";
import DropDownIcon from "../assets/Vector.svg";
import ArrowIcon from "../assets/ArrowIcon.svg";
import BottomDownArrowIcon from "../assets/BottomArrow.svg";
import ArrowLeft from "../assets/ArrowLeft.svg";

enum JobType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  INTERNSHIP = "Internship",
  FREELANCE = "Freelance",
  ANY = "Any Job Type",
}

const jobFormSchema = z
  .object({
    jobTitle: z
      .string()
      .min(3, { message: "Job title is required (min 3 characters)" })
      .max(100, { message: "Job title must be less than 100 characters" }),
    companyName: z
      .string()
      .min(2, { message: "Company name is required (min 2 characters)" })
      .max(50, { message: "Company name must be less than 50 characters" }),
    location: z.string().min(3, { message: "Location is required" }),
    jobType: z.nativeEnum(JobType, {
      message: "Please select a valid job type",
    }),
    minSalary: z.string().min(1, { message: "Minimum salary is required" }),
    maxSalary: z.string().min(1, { message: "Maximum salary is required" }),
    deadline: z
      .string()
      .min(1, { message: "Application deadline is required" }),
    jobDescription: z
      .string()
      .min(20, { message: "Job description must be at least 20 characters" }),
  })
  .refine(
    (data) => {
      const min = parseFloat(data.minSalary);
      const max = parseFloat(data.maxSalary);
      return min < max;
    },
    {
      message: "Minimum salary must be less than maximum salary",
      path: ["minSalary"],
    }
  );

type JobFormValues = z.infer<typeof jobFormSchema>;

interface OptionType {
  id: string;
  name: string;
  icon?: IconType;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const JobOpeningModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      jobType: JobType.ANY,
      location: "Choose Preferred Location",
    },
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  // console.log("hello world");

  const onSubmit: SubmitHandler<JobFormValues> = async (data) => {
    try {
      setSubmitError(null);

      const formattedData = {
        job_title: data.jobTitle,
        company_name: data.companyName,
        location: data.location,
        job_type: data.jobType,
        salary_range: `${data.minSalary}-${data.maxSalary}`,
        job_description: data.jobDescription,
        application_deadline: new Date(data.deadline).toISOString(),
        id: 0,
      };
      const response = await axios.post(
        `${"https://cw-backend-25rn.onrender.com"}/jobs` || "",
        formattedData
      );
      setSubmitSuccess(true);
      reset();
      setIsOpen(false);
      setSubmitSuccess(false);
      reset();
    } catch (error) {
      console.error("Error creating job:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create job. Please try again."
      );
    }
  };

  const saveDraft: SubmitHandler<JobFormValues> = async (data) => {
    if (
      !data.jobTitle ||
      !data.companyName ||
      !data.location ||
      !data.jobType
    ) {
      setSubmitError(
        "Please fill in all required fields before saving the draft."
      );
      return;
    }

    const formattedData = {
      job_title: data.jobTitle,
      company_name: data.companyName,
      location: data.location,
      job_type: data.jobType,
      salary_range: `${data.minSalary}-${data.maxSalary}`,
      job_description: data.jobDescription,
      id: 0,
    };

    localStorage.setItem("jobDraft", JSON.stringify(formattedData));
    setDraftSaved(true);

    setTimeout(() => {
      setDraftSaved(false);
    }, 2000);
  };

  const getValue = (field: keyof JobFormValues): string => {
    const element = document.querySelector(
      `[name="${field}"]`
    ) as HTMLInputElement;
    return element?.value || "";
  };
  const closeModal = () => {
    reset();
    setSubmitError(null);
    setDraftSaved(false);
    setIsOpen(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.id === "modal-overlay") {
      setIsOpen(false);
      closeModal();
    }
  };

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<OptionType>({
    id: "Choose Preferred Location",
    name: "Choose Preferred Location",
    icon: FiMapPin,
  });

  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const jobTypeDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedJobType, setSelectedJobType] = useState<OptionType>({
    id: "ANY",
    name: JobType.ANY,
    icon: FiBriefcase,
  });

  const locations: OptionType[] = [
    {
      id: "Choose Preferred Location",
      name: "Choose Preferred Location",
      icon: FiMapPin,
    },
    { id: "chennai", name: "Chennai", icon: FiMapPin },
    { id: "bangalore", name: "Bangalore", icon: FiMapPin },
    { id: "hyderabad", name: "Hyderabad", icon: FiMapPin },
    { id: "coimbatore", name: "Coimbatore", icon: FiMapPin },
  ];

  const jobTypes: OptionType[] = [
    { id: "ANY", name: JobType.ANY, icon: FiBriefcase },
    { id: "FULL_TIME", name: JobType.FULL_TIME, icon: FiBriefcase },
    { id: "PART_TIME", name: JobType.PART_TIME, icon: FiBriefcase },
    { id: "INTERNSHIP", name: JobType.INTERNSHIP, icon: FiBriefcase },
  ];

  const toggleLocationDropdown = () => {
    setIsLocationOpen(!isLocationOpen);
    if (isJobTypeOpen) setIsJobTypeOpen(false);
  };

  const selectLocation = (location: OptionType) => {
    setSelectedLocation(location);
    setValue("location", location.name, { shouldValidate: true });
    setIsLocationOpen(false);
  };

  const selectJobType = (jobType: OptionType) => {
    setSelectedJobType(jobType);
    setValue("jobType", jobType.name as JobType, { shouldValidate: true });
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
      const target = event.target as HTMLElement;

      if (locationDropdownRef.current && target.id === "test1") {
        setIsLocationOpen(false);
      }
      if (jobTypeDropdownRef.current && target.id === "test2") {
        setIsJobTypeOpen(false);
      }
    };

    if (isLocationOpen || isJobTypeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLocationOpen, isJobTypeOpen]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("jobDraft");
    if (savedDraft && isOpen) {
      try {
        const draftData = JSON.parse(savedDraft);

        setValue("jobTitle", draftData.jobTitle || "");
        setValue("companyName", draftData.companyName || "");
        setValue("minSalary", draftData.minSalary || "");
        setValue("maxSalary", draftData.maxSalary || "");
        setValue("deadline", draftData.deadline || "");
        setValue("jobDescription", draftData.jobDescription || "");

        if (draftData.location) {
          const locationOption = locations.find(
            (loc) => loc.name === draftData.location
          );
          if (locationOption) {
            setSelectedLocation(locationOption);
            setValue("location", locationOption.name);
          }
        }

        if (draftData.jobType) {
          const jobTypeOption = jobTypes.find(
            (type) => type.name === draftData.jobType
          );
          if (jobTypeOption) {
            setSelectedJobType(jobTypeOption);
            setValue("jobType", jobTypeOption.name as JobType);
          }
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [isOpen, setValue]);

  return (
    <>
      {isOpen && (
        <div
          id="modal-overlay"
          onClick={(e) => handleBackgroundClick(e)}
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in flex items-center justify-center"
        >
          <div className="bg-white rounded-xl p-6 w-[748px] max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200 z-50">
            <h2 className="text-center text-2xl font-[SatoshiSemiBold] text-[#222222]">
              Create Job Opening
            </h2>

            {submitError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h1 className="text-[#636363] font-[SatoshiMedium] text-xl mb-2">
                    Job Title
                  </h1>
                  <input
                    {...register("jobTitle")}
                    placeholder="Job Title"
                    className={`border rounded-md py-2 text-xl placeholder:text-[16px] pl-3 placeholder:font-[SatoshiMedium] w-full font-[SatoshiMedium] focus:outline-none focus:ring-1 focus:ring-black ${
                      errors.jobTitle ? "border-red-500" : "border-[#BCBCBC]"
                    }`}
                  />
                  {errors.jobTitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>
                <div>
                  <h1 className="text-[#636363] font-[SatoshiMedium] text-xl mb-2 -mt-0.5">
                    Company Name
                  </h1>
                  <input
                    {...register("companyName")}
                    placeholder="Amazon, Microsoft, Swiggy"
                    className={`border rounded-md py-2 text-xl pl-3 placeholder:font-[SatoshiMedium] placeholder:text-[15px] w-full font-[SatoshiMedium] focus:outline-none focus:ring-1 focus:ring-black ${
                      errors.companyName ? "border-red-500" : "border-[#BCBCBC]"
                    }`}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="relative">
                  <h1 className="text-[#636363] font-[SatoshiMedium] text-xl mb-2">
                    Location
                  </h1>
                  <div ref={locationDropdownRef}>
                    <div id="test1" className="relative w-full">
                      <button
                        type="button"
                        onClick={toggleLocationDropdown}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-gray-600 bg-white border ${
                          errors.location
                            ? "border-red-500 border"
                            : "border-gray-300 border"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-[#686868] font-[SatoshiMedium] text-[16px]">
                            {selectedLocation?.name}
                          </span>
                        </div>
                        <motion.div
                          animate={isLocationOpen ? "open" : "closed"}
                          variants={iconVariants}
                          className="ml-5"
                        >
                          <Image src={DropDownIcon} alt="DropIcon" />
                        </motion.div>
                      </button>

                      {isLocationOpen && (
                        <motion.div
                          initial={wrapperVariants.closed}
                          animate="open"
                          variants={wrapperVariants}
                          className="absolute z-10 w-[95%] mt-1 bg-white rounded-md shadow-lg"
                          style={{ originY: "top" }}
                        >
                          <ul className="py-1">
                            {locations.map((location) => (
                              <motion.li
                                key={location.id}
                                variants={itemVariants}
                                onClick={() => selectLocation(location)}
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
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <h1 className="text-[#636363] font-[SatoshiMedium] text-xl mb-2">
                    Job Type
                  </h1>
                  <div ref={jobTypeDropdownRef}>
                    <div id="test2" className="relative w-full">
                      <button
                        type="button"
                        onClick={toggleJobTypeDropdown}
                        className={`flex items-center justify-between w-full px-4 py-3 text-gray-600 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-black ${
                          errors.jobType
                            ? "border-red-500 border"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-[#686868] font-[SatoshiMedium] text-[15px]">
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
                  {errors.jobType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobType.message}
                    </p>
                  )}
                </div>
              </div>
              <div className=" flex flex-row  gap-x-60 mt-1 items-center">
                <h1 className="text-[#636363] font-[SatoshiMedium] text-xl mt-2">
                  Salary Range
                </h1>
                <div>
                  <h1 className="text-[#636363] font-[SatoshiMedium] text-xl ">
                    Application Deadline
                  </h1>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-row gap-x-2">
                  <div
                    className={`flex items-center rounded-md p-2 text-sm w-full font-[SatoshiMedium] ${
                      errors.minSalary
                        ? "border-red-500 border"
                        : "border border-gray-300"
                    }`}
                  >
                    <Image src={ArrowIcon} alt="Arrow Icon" className="mr-3" />
                    <span className="text-gray-500 mr-1">₹</span>
                    <input
                      {...register("minSalary")}
                      type="number"
                      className="outline-none w-full h-10 text-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                  </div>
                  <div
                    className={`flex items-center rounded-md  py-1 text-sm w-full font-[SatoshiMedium] ${
                      errors.maxSalary
                        ? "border-red-500 border"
                        : "border border-gray-300"
                    }`}
                  >
                    <Image
                      src={ArrowIcon}
                      alt="Arrow Icon"
                      className="ml-2 mr-2"
                    />
                    <span className="text-gray-500 mr-1">₹</span>
                    <input
                      {...register("maxSalary")}
                      type="number"
                      className="outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="12,00,000"
                    />
                  </div>
                </div>
                <div>
                  <input
                    {...register("deadline")}
                    type="date"
                    className={`flex items-center justify-between w-full px-4 py-4 font-[SatoshiMedium] rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-black ${
                      errors.deadline
                        ? "border-red-500 border"
                        : "border border-gray-300"
                    }`}
                  />
                  {errors.deadline && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deadline.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-x-4">
                {errors.minSalary && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.minSalary.message}
                  </p>
                )}
                {errors.maxSalary && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maxSalary.message}
                  </p>
                )}
              </div>
              <h1 className="text-[#636363] font-[SatoshiMedium] text-xl mt-4">
                Job Description
              </h1>
              <textarea
                {...register("jobDescription")}
                placeholder="Please share a description to let the candidate know more about the job role"
                className={`rounded-md p-2 text-md w-full h-20 max-h-32 min-h-10 mt-3 font-[SatoshiMedium] placeholder:font-[SatoshiMedium] focus:outline-none focus:ring-1 focus:ring-black resize-y ${
                  errors.jobDescription
                    ? "border-red-500 border"
                    : "border border-gray-300"
                }`}
              />
              {errors.jobDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.jobDescription.message}
                </p>
              )}
              {submitSuccess && (
                <div className="mt-2 font-[SatoshiMedium] text-green-700 rounded-md">
                  Job successfully published!
                </div>
              )}
              {draftSaved && (
                <div className="mt-2 font-[SatoshiMedium] text-blue-700 rounded-md">
                  Draft saved successfully!
                </div>
              )}
              <div className="flex justify-between items-center mt-8 z-50">
                <button
                  type="button"
                  onClick={() => handleSubmit(saveDraft)()}
                  className="border border-[#222222] rounded-md px-6 py-2 text-md font-[SatoshiMedium] flex gap-x-2 cursor-pointer items-center"
                >
                  Save Draft{" "}
                  <Image src={BottomDownArrowIcon} alt="Icon" className=" " />
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting
                      ? "bg-blue-400"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white flex flex-row items-center cursor-pointer gap-x-2 px-6 py-2.5 text-md rounded-md text-sm font-[SatoshiMedium] shadow-md transition`}
                >
                  {isSubmitting ? "Publishing..." : "Publish"}{" "}
                  {!isSubmitting && <Image src={ArrowLeft} alt="Icon" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JobOpeningModal;
