/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import FilterSections from "../components/FilterSection";
import JobOpeningModal from "../components/CreateJobModal";
import Card from "../components/Card";

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
    // setLoading(true);
    const { data, error } = await fetchData(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs`
    );

    if (error) {
      setError(error);
    } else {
      setJobs(data);
      setError(null);
    }
    // setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [isOpen]);
  return (
    <div>
      <div className="flex flex-row items-center justify-center m-5">
        <NavBar setIsOpen={setIsOpen} />
      </div>

      <div>
        <FilterSections setJobs={setJobs} setLoading={setLoading} />
      </div>

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
        <div className="text-center mt-10 text-lg font-semibold text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center mt-10 text-lg font-semibold">
          No jobs found
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 mb-20 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ml-20 gap-4 sm:mt-72 lg:mt-10 md:mt-72 xs:mt-72">
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
