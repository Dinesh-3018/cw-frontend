/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import FilterSections from "../components/FilterSection";
import JobOpeningModal from "../components/CreateJobModal";
import Card from "../components/Card";
import Image from "next/image";
import NoData from "../assets/No_data.jpg";
export interface Job {
  id: number;
  title: string;
  company: string;
  company_name: string;
  location: string;
  salary: string;
  type: string;
}

const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return { data: response.data?.data, error: null };
  } catch (error) {
    console.error("API Error:", error);
    return {
      data: null,
      error:
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Something went wrong. Please try again later.",
    };
  }
};

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [closeWarning, setCloseWarning] = useState(true);
  const [ShowDraft, setShowDraft] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const { data, error } = await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs`
      );

      if (error) {
        setError(error);
      } else {
        setJobs(data);
        setError(null);
      }
      setLoading(false);
    };

    loadJobs();
  }, [""]);
  const fetchJobs = async () => {
    const { data, error } = await fetchData(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs`
    );

    if (error) {
      setError(error);
    } else {
      setJobs(data);
      setError(null);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [isOpen]);

  const ShowDraftHandler = (
    value: boolean | ((prevState: boolean) => boolean)
  ) => {
    setShowDraft(value);
    const storedJobs = JSON.parse(localStorage.getItem("jobDraft") || "[]");
    setJobs(storedJobs.filter((job: any) => job.type === "draft"));
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-center m-5">
        <NavBar setIsOpen={setIsOpen} />
      </div>

      <div>
        <FilterSections setJobs={setJobs} setLoading={setLoading} />
      </div>
      {loading && closeWarning && (
        <div className="w-96  absolute right-0 top-40 mt-10 mr-10">
          <div
            role="alert"
            className="bg-yellow-100 dark:bg-yellow-900  border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-yellow-200 dark:hover:bg-yellow-800 transform hover:scale-105"
          >
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 flex-shrink-0 mr-2 text-yellow-600 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-xs font-[SatoshiMedium]">
              Warning: Backend & PostgreSQL are on Render. They sleep after 15
              mins of inactivity. If slow, just refresh!
            </p>
            <div>
              <button
                onClick={() => {
                  setCloseWarning(false);
                }}
                className="ml-2 text-yellow-900 dark:text-yellow-100 cursor-pointer hover:text-yellow-900 dark:hover:text-yellow-100"
              >
                <span className="sr-only">Close</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <>
          <div className="mt-20">
            <div className="bg-white p-2 sm:p-4 sm:h-64 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-5 select-none ">
              <div className="h-52 sm:h-full sm:w-72 rounded-xl bg-gray-200 animate-pulse"></div>
              <div className="flex flex-col flex-1 gap-5 sm:p-2">
                <div className="flex flex-1 flex-col gap-3">
                  <div className="bg-gray-200 w-full animate-pulse h-14 rounded-2xl"></div>
                  <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                  <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                  <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                  <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-2  mt-10 sm:p-4 sm:h-64 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-5 select-none ">
              <div className="h-52 sm:h-full sm:w-72 rounded-xl bg-gray-200 animate-pulse"></div>
              <div className="flex flex-col flex-1 gap-5 sm:p-2">
                <div className="flex flex-1 flex-col gap-3">
                  <div className="bg-gray-200 w-full animate-pulse h-14 rounded-2xl"></div>
                  <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                  <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                  <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                  <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && error && (
        <div className="text-center mt-10 text-lg font-[SatoshiMedium] text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <>
          <div className="text-center mt-5 text-lg  flex flex-row justify-center font-[SatoshiMedium]">
            <Image src={NoData} alt="Icon" className="w-1/2" />
          </div>
          <div>
            <h1 className=" font-[SatoshiMedium] text-center text-2xl text-black">
              No Jobs Found
            </h1>
          </div>
        </>
      )}
      {/* {!loading && !error && (
        <div className=" flex flex-row items-center gap-x-2 ml-10 mt-4">
          <div className="">
            <label className="relative inline-block h-6 w-12 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
              <input
                className="peer sr-only"
                id="AcceptConditions"
                type="checkbox"
                onChange={(e) => ShowDraftHandler(e.target.checked)}
              />
              <span className="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
            </label>
          </div>
          <div>
            <h1 className="text-[#686868] font-[SatoshiMedium] text-lg">
              Show Draft
            </h1>
          </div>
        </div>
      )} */}
      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 mb-20 sm:grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-4 ml-10 mr-10  sm:mt-72 lg:mt-10 md:mt-72 xs:mt-72">
          {jobs.map((job) => (
            <Card key={job.id} job={job} />
          ))}
        </div>
      )}

      <div>
        <JobOpeningModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};

export default Page;
