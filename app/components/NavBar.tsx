/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assets/Logo.svg";
import { usePathname } from "next/navigation";

const NavBar = ({ setIsOpen }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0  bg-white shadow-lg border-t  rounded-full xl:w-6/12  w-full  border border-white/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative w-12 xl:h-12 h-10">
            <Image
              src={Logo}
              alt="Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 font-[SatoshiMedium] ">
          <Link
            href="/"
            className={`${
              isActive("/")
                ? "text-purple-600 font-semibold"
                : "text-gray-800 hover:text-gray-600"
            } font-medium`}
          >
            Home
          </Link>
          <Link
            href="/find-jobs"
            className={`${
              isActive("/jobs")
                ? "text-purple-600 font-semibold"
                : "text-gray-800 hover:text-gray-600"
            } font-medium`}
          >
            Find Jobs
          </Link>
          <Link
            href="/find-talents"
            className={`${
              isActive("/find-talents")
                ? "text-purple-600 font-semibold"
                : "text-gray-800 hover:text-gray-600"
            } font-medium`}
          >
            Find Talents
          </Link>
          <Link
            href="/about-us"
            className={`${
              isActive("/about-us")
                ? "text-purple-600 font-semibold"
                : "text-gray-800 hover:text-gray-600"
            } font-medium`}
          >
            About us
          </Link>
          <Link
            href="/testimonials"
            className={`${
              isActive("/testimonials")
                ? "text-purple-600 font-semibold"
                : "text-gray-800 hover:text-gray-600"
            } font-medium`}
          >
            Testimonials
          </Link>
        </nav>

        <div
          onClick={() => setIsOpen(true)}
          className="hidden md:block bg-purple-gradient hover:opacity-90 cursor-pointer text-white font-[SatoshiMedium] py-2 px-4 rounded-full"
        >
          Create Jobs
        </div>

        <button className="md:hidden text-gray-800" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white absolute  top-full mt-10 left-0 right-0 shadow-md rounded">
          <nav className="flex flex-col py-2 font-[SatoshiMedium]">
            <Link
              href="/"
              className={`px-4 py-2 ${
                isActive("/")
                  ? "text-purple-600 font-semibold"
                  : "text-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className={`px-4 py-2 ${
                isActive("/jobs")
                  ? "text-purple-600 font-semibold"
                  : "text-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/"
              className={`px-4 py-2 ${
                isActive("/find-talents")
                  ? "text-purple-600 font-semibold"
                  : "text-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Find Talents
            </Link>
            <Link
              href="/"
              className={`px-4 py-2 ${
                isActive("/about-us")
                  ? "text-purple-600 font-semibold"
                  : "text-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About us
            </Link>
            <Link
              href="/"
              className={`px-4 py-2 ${
                isActive("/testimonials")
                  ? "text-purple-600 font-semibold"
                  : "text-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <div
              onClick={() => setIsOpen(true)}
              className="mx-4 my-2 bg-purple-600 cursor-pointer text-white text-center font-medium py-2 px-4 rounded-full"
            >
              Create Jobs
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
