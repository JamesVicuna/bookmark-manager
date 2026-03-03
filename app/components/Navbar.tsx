"use client"
import Image from "next/image";
import { ReactNode } from "react";
import { Search } from "./Search";
import { AddBookmarkButton } from "./AddBookmark";

export const Navbar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className=" drawer-content flex flex-col">
        {/* Navbar */}
        <div className=" navbar w-full px-8 bg-base-100">
          <div className="flex w-full justify-between gap-2">
            {/* Navbar Left Side */}
            <div className="flex flex-1 gap-2 min-w-0">
              <div className="flex-none lg:hidden">
                <label
                  htmlFor="sidebar-drawer"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost border-2 border-base-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-6 w-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
              <Search />
            </div>

            {/* Navbar Right Side */}
            <div>
              <AddBookmarkButton />
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="sidebar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu w-80 p-4 min-h-full bg-base-100">
          <Image
            src={"/images/logo-light-theme.svg"}
            width={180}
            height={40}
            alt="logo"
            className="py-2 mb-2"
          />
          <li>
            <button>
              <Image
                src={"/images/icon-home.svg"}
                className=" h-full w-auto mr-0.5"
                width={20}
                height={20}
                alt="Home"
              />
              Home
            </button>
          </li>
          <li>
            <button>
              <Image
                src={"/images/icon-archive.svg"}
                className=" h-full w-auto mr-0.5"
                width={20}
                height={20}
                alt="Home"
              />
              Archived
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
