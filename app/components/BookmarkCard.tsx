"use client";
import Image from "next/image";
import { Bookmark } from "../types/bookmarks";
import { useBookmarksStore, BookmarksState } from "../stores/useBookmarksStore";
import { EditBookmarkButton } from "./EditBookmark";
import { openModal } from "../utils/modal";
import { ModalState, useModalStore } from "../stores/useModalStore";

type DropdownItem<T> = {
  title: string | ((context: T) => string);
  svg: string;
  onClick: (context: T) => void;
};
const dropdownItems: DropdownItem<{
  bookmark: Bookmark;
  updateBookmark: BookmarksState["updateBookmark"];
  openEditModal: ModalState["openEditModal"];
}>[] = [
  {
    title: "Vist",
    svg: "/images/icon-visit.svg",
    onClick: async ({ bookmark, updateBookmark }) => {
      const update = {
        visit_count: bookmark.visit_count + 1,
      };

      await updateBookmark(bookmark.id, update);
      // open in new window
      window.open(bookmark.url, "_blank", "noopener,noreferrer");
    },
  },
  {
    title: "Copy URL",
    svg: "/images/icon-copy.svg",
    onClick: ({ bookmark }) => {
      navigator.clipboard.writeText(bookmark.url);
    },
  },
  {
    title: ({ bookmark }) => (bookmark.pinned ? "Unpin" : "Pin"),
    svg: "/images/icon-unpin.svg",
    onClick: async ({ bookmark, updateBookmark }) => {
      // Set a query to database to pin / unpin
      const update = {
        pinned: !bookmark.pinned,
      };
      await updateBookmark(bookmark.id, update);
    },
  },
  {
    title: "Edit",
    svg: "/images/icon-edit.svg",
    onClick: ({ bookmark, openEditModal }) => {
      // Open up the edit bookmark modal and send a query to the database to update
      // TODO - after creating the edit bookmark modal edit this
      // if (document.activeElement instanceof HTMLElement) {
      //   document.activeElement.blur();
      // }
      // requestAnimationFrame(() => {
        openEditModal(bookmark);
      // });
    },
  },
  {
    title: "Archive",
    svg: "/images/icon-archive.svg",
    onClick: async ({ bookmark, updateBookmark }) => {
      // Set a query to database to archive the blog
      const edit = {
        is_archived: !bookmark.is_archived,
      };
      await updateBookmark(bookmark.id, edit);
    },
  },
];

export const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  const updateBookmark = useBookmarksStore((state) => state.updateBookmark);
  const openEditModal = useModalStore((state) => state.openEditModal);
  const context = {
    bookmark,
    updateBookmark,
    openEditModal,
  };

  return (
    <div className="card bg-base-100 min-w-84.5">
      <div id="header+body" className="p-4">
        <div id="header" className="flex border-b border-b-base-300 pb-4 gap-4">
          {/* Image + Title + Href, Options */}

          <Image
            src={"/images/favicon-claude.png"}
            className=" rounded-xl border border-base-300 h-full
               w-auto p-1"
            alt="Bookmark Image"
            height={32}
            width={32}
          />
          <div className="flex-1 min-w-0">
            <h1 className=" font-semibold">{bookmark.title}</h1>
            <p className="truncate">{bookmark.url}</p>
          </div>

          {/* Dropdown */}
          <div
            id="options"
            className="ml-auto dropdown dropdown-bottom dropdown-end h-min"
          >
            <div
              tabIndex={0}
              role="button"
              className="m-1 border rounded-lg border-base-300 p-0.5"
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
                    <button
                      className="flex gap-2"
                      onClick={() => item.onClick(context)}
                    >
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
        <div id="body" className="flex flex-col gap-4 py-4">
          <p>{bookmark.description}</p>
          <div className="flex gap-2 flex-wrap">
            {bookmark.tags?.map((tag) => (
              <span
                className=" badge badge-accent badge-sm rounded-sm"
                key={`${tag.title} ${bookmark.title}`}
              >
                {tag.title}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div id="footer" className="mt-auto">
        <hr className="border border-base-300 w-full" />
        <div className="flex gap-2 justify-between p-4 ">
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
    </div>
  );
};
