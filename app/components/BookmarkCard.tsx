import Image from "next/image";
import { Bookmark } from "../types/bookmarks";
import favicon from "@/public/images/favicon-32x32.png";

const bookmark: Bookmark = {
  title: "hello",
  url: "string",
  description:
    "This is the decription of the bookmark. there will be a good amount of content in her. I have alot to say about this bookmark. Lots and lots of texzt in here",
  created_at: "Jan 15",
  last_visited: "Feb 27",
  visit_count: 27,
  tags: [
    {
      title: "string",
    },
    {
      title: "string",
    },
    {
      title: "string",
    },
  ],
};

export const BookmarkCard = () => {
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
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
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
