"use client";
import Image from "next/image";
import { Bookmark } from "../types/bookmarks";
import { useBookmarksStore, BookmarksState } from "../stores/useBookmarksStore";
import { ModalState, useModalStore } from "../stores/useModalStore";
import { formatDate } from "../utils/date";
import { Favicon } from "./Favicon";
import { memo } from "react";
import { toast } from "react-hot-toast";

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
        last_visited: new Date().toISOString(),
      };

      toast.promise(updateBookmark(bookmark.id, update), {
        loading: "loading...",
        success: "Off you go!",
        error: "Oops i can't take you there",
      });
      // open in new window
      const safeUrl = bookmark.url.startsWith("http")
        ? bookmark.url
        : `https://${bookmark.url}`;
      window.open(safeUrl, "_blank", "noopener,noreferrer");
    },
  },
  {
    title: "Copy URL",
    svg: "/images/icon-copy.svg",
    onClick: ({ bookmark }) => {
      navigator.clipboard.writeText(bookmark.url);
      toast.success("Copied!");
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
      toast.promise(updateBookmark(bookmark.id, update), {
        loading: "Loading...",
        success: bookmark.pinned ? "Unpinned!" : "Pinned!",
        error: "Error updating pin...",
      });
    },
  },
  {
    title: "Edit",
    svg: "/images/icon-edit.svg",
    onClick: ({ bookmark, openEditModal }) => {
      openEditModal(bookmark);
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
      toast.promise(updateBookmark(bookmark.id, edit), {
        loading: "Loading...",
        success: bookmark.is_archived ? "Unarchived!" : "Archived!",
        error: "Error updating archive...",
      });
    },
  },
];

const deleteDropDown: DropdownItem<{
  bookmark: Bookmark;
  deleteBookmark: BookmarksState["deleteBookmark"];
}> = {
  title: "Delete",
  svg: "/images/icon-delete.svg",
  onClick: async ({ bookmark, deleteBookmark }) => {
    toast.promise(deleteBookmark(bookmark.id), {
      loading: "Deleting...",
      success: "Deleted!",
      error: "Error deleting bookmark",
    });
  },
};

export const BookmarkCard = memo(({ bookmark }: { bookmark: Bookmark }) => {
  const updateBookmark = useBookmarksStore((state) => state.updateBookmark);
  const deleteBookmark = useBookmarksStore((state) => state.deleteBookmark);
  const openEditModal = useModalStore((state) => state.openEditModal);
  const context = {
    bookmark,
    updateBookmark,
    openEditModal,
    deleteBookmark,
  };

  return (
    <div className="card bg-base-100 min-w-84.5">
      <div id="header+body" className="p-4">
        <div id="header" className="flex border-b border-b-base-300 pb-4 gap-4">
          <Favicon url={bookmark.url} key={bookmark.url} />
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
              {bookmark.is_archived && (
                <li key={deleteDropDown.title + bookmark.title}>
                  <button
                    className="flex gap-2"
                    onClick={() => deleteDropDown.onClick(context)}
                  >
                    <Image
                      src={deleteDropDown.svg}
                      className=" rounded-xl border border-base-300 h-full w-auto p-1"
                      alt={deleteDropDown.title as string}
                      height={16}
                      width={16}
                    />
                    <span>{deleteDropDown.title as string}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
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
            {bookmark.last_visited && (
              <span id="last-visited" className="flex gap-2">
                <Image
                  src={"/images/icon-last-visited.svg"}
                  alt="last visited"
                  width={16}
                  height={16}
                />
                <span>{formatDate(new Date(bookmark.last_visited))}</span>
              </span>
            )}
            <span id="created-at" className="flex gap-2">
              <Image
                src={"/images/icon-created.svg"}
                alt="created at"
                width={16}
                height={16}
              />
              <span>{formatDate(new Date(bookmark.created_at))}</span>
            </span>
          </div>
          {bookmark.is_archived && (
            <span className="badge badge-accent badge-sm rounded-sm">
              Archived
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

BookmarkCard.displayName = "BookmarkCard";
