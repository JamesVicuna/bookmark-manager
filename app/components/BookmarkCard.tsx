"use client";
import Image from "next/image";
import { Bookmark } from "../types/bookmarks";
import favicon from "@/public/images/favicon-32x32.png";
import { url } from "inspector";
import { useState, SetStateAction, Dispatch } from "react";
import axios from "axios";

// const bookmark: Bookmark = {
//   title: "hello",
//   url: "string",
//   description:
//     "This is the decription of the bookmark. there will be a good amount of content in her. I have alot to say about this bookmark. Lots and lots of texzt in here",
//   created_at: "Jan 15",
//   last_visited: "Feb 27",
//   visit_count: 27,
//   tags: [
//     {
//       title: "string",
//     },
//     {
//       title: "string",
//     },
//     {
//       title: "string",
//     },
//   ],
// };

type DropdownItem<T> = {
  title: string | ((context: T) => string);
  svg: string;
  onClick: (context: T) => void;
};
const dropdownItems: DropdownItem<{
  id: string;
  url: string;
  pinned: boolean;
  bookmark: Bookmark;
  setBookmark: Dispatch<SetStateAction<Bookmark>>;
}>[] = [
  {
    title: "Vist",
    svg: "/images/icon-visit.svg",
    onClick: async ({ url, setBookmark, id, bookmark }) => {
      // update visit count + 1
      try {
        const res = await axios.patch(`/api/bookmarks/${id}`, {
          visit_count: bookmark.visit_count + 1,
        });

        const updatedBookmark: Bookmark = res.data;

        setBookmark(updatedBookmark);
      } catch (error) {
        // TODO - apply a toast here if there is an error
        console.log("error adding bookmark to visit count");
      }

      // open in new window
      window.open(url, "_blank", "noopener,noreferrer");
    },
  },
  {
    title: "Copy URL",
    svg: "/images/icon-copy.svg",
    onClick: ({ url }) => {
      navigator.clipboard.writeText(url);
    },
  },
  {
    title: ({ pinned }) => (pinned ? "Pin" : "Unpin"),
    svg: "/images/icon-unpin.svg",
    onClick: async ({ id, pinned, bookmark, setBookmark }) => {
      // Set a query to database to pin / unpin
      try {
        const res = await axios.patch(`/api/bookmarks/${id}`, {
          pinned: !pinned,
        });

        const updatedBookmark: Bookmark = res.data;
        setBookmark(updatedBookmark);
      } catch (error) {
        // TODO - create a toast that shows successfull
        console.log("Error pinning / the bookmark");
      }
    },
  },
  {
    title: "Edit",
    svg: "/images/icon-edit.svg",
    onClick: ({ id }) => {
      // Open up the edit bookmark modal and send a query to the database to update
      // TODO - after creating the edit bookmark modal edit this
    },
  },
  {
    title: "Archive",
    svg: "/images/icon-archive.svg",
    onClick: async ({ id, setBookmark, bookmark }) => {
      // Set a query to database to archive the blog
      try {
        const res = await axios.post(`/api/bookmarks/${id}`, {
          is_archived: !bookmark.is_archived,
        });

        const updatedBookmark: Bookmark = res.data;
        setBookmark(updatedBookmark);
      } catch (error) {
        // TODO - have a toast that shows the bookmark was archived
        console.log("error archving the bookmark");
      }
    },
  },
];

export const BookmarkCard = ({
  bookmark,
  setBookmark,
}: {
  bookmark: Bookmark;
  setBookmark: Dispatch<SetStateAction<Bookmark>>;
}) => {
  const context = {
    id: bookmark.id,
    url: bookmark.url,
    pinned: bookmark.pinned,
    bookmark,
    setBookmark,
  };

  return (
    <div className="card bg-red-50">
      <div id="header+body" className="p-4">
        <div
          id="header"
          className="flex justify-between border-b border-b-base-300 pb-4"
        >
          {/* Image + Title + Href, Options */}
          <div id="title" className="flex gap-4">
            <Image
              src={"/images/favicon-claude.png"}
              className=" rounded-xl border border-base-300 h-full
               w-auto p-1"
              alt="Bookmark Image"
              height={32}
              width={32}
            />
            <div>
              <h1 className=" font-semibold">{bookmark.title}</h1>
              <p>{bookmark.url}</p>
            </div>
          </div>
          {/* Dropdown */}
          <div id="options" className=" dropdown dropdown-bottom dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="m-1 border rounded-lg border-base-300"
            >
              <Image
                src={"/images/icon-menu-bookmark.svg"}
                alt="menu"
                width={32}
                height={32}
              />
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              {dropdownItems.map((item) => {
                const resolvedTitle =
                  typeof item.title === "string"
                    ? item.title
                    : item.title(context);

                return (
                  <li key={item.title + bookmark.title}>
                    <button className="flex gap-2">
                      <Image
                        src={item.svg}
                        className=" rounded-xl border border-base-300 h-full w-auto p-1"
                        alt={resolvedTitle}
                        height={16}
                        width={16}
                      />
                      <span>{resolvedTitle}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* <hr className=" border border-base-300 w-full" /> */}
        <div id="body" className="">
          <p>{bookmark.description}</p>
          <div className="flex gap-2">
            {bookmark.tags?.map((tag) => (
              <span className=" badge" key={`${tag.title} ${bookmark.title}`}>
                {tag.title}
              </span>
            ))}
          </div>
        </div>
      </div>
      <hr className=" border border-base-300 w-full" />
      <div id="footer" className="flex gap-2 justify-between p-4">
        <div className="flex gap-2">
          <span id="view-count" className="flex gap-2">
            <Image
              src={"/images/icon-visit-count.svg"}
              alt="views"
              width={16}
              height={16}
            />
            <span>{bookmark.visit_count}</span>
          </span>
          <span id="last-visited" className="flex gap-2">
            <Image
              src={"/images/icon-last-visited.svg"}
              alt="last visited"
              width={16}
              height={16}
            />
            <span>{bookmark.last_visited}</span>
          </span>
          <span id="created-at" className="flex gap-2">
            <Image
              src={"/images/icon-created.svg"}
              alt="created at"
              width={16}
              height={16}
            />
            <span>{bookmark.created_at}</span>
          </span>
        </div>
        {bookmark.is_archived ?? <span className="badge">Archived</span>}
      </div>
    </div>
  );
};
