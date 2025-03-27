/* eslint-disable react-hooks/exhaustive-deps */
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
import Loader from "../utils/Loader";
import Alert from "../utils/Alert";
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
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://cw-backend-25rn.onrender.com"
        }/jobs`
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
      `${
        process.env.NEXT_PUBLIC_API_URL ||
        "https://cw-backend-25rn.onrender.com"
      }/jobs`
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
      {loading && closeWarning && <Alert setCloseWarning={setCloseWarning} />}

      {loading && <Loader />}

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

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4 ml-10 mr-10 mb-20 sm:mt-72 lg:mt-72 md:mt-72 xs:mt-72 mt-72 xl:mt-5">
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
