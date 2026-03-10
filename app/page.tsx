"use client";

import { BookmarkCard } from "./components/BookmarkCard";
import { useBookmarksStore } from "./stores/useBookmarksStore";
import { useMemo } from "react";
import { EditBookmarkButton } from "./components/EditBookmark";
import { useModalStore } from "./stores/useModalStore";
import { usePageStore, Pages } from "./stores/usePageStore";
import { ToasterHub } from "./components/Toaster";
import { useFiltersStore } from "./stores/useFilterStore";

export default function Home() {
  const filteredTags = useFiltersStore((state) => state.filteredTags);
  const { bookmarks, initialLoading } = useBookmarksStore();
  const editBookmark = useModalStore((state) => state.editBookmark);
  const page = usePageStore((state) => state.page);
  const searchQuery = useFiltersStore((state) => state.searchQuery)
  const titles: Record<Pages, string> = {
    [Pages.ALL]: "All Bookmarks",
    [Pages.ARCHIVED]: "Archived",
  };
  const title = titles[page];

  const filteredBookmarks = useMemo(() => {
    let result = bookmarks;

    // 1. Page Filter
    switch (page) {
      case Pages.ARCHIVED:
        result = result.filter((bookmark) => bookmark.is_archived);
        break;
      case Pages.ALL:
        result = result.filter((bookmark) => !bookmark.is_archived);
        break;
      default:
        break;
    }
    
    // 2. Tag Filter
    if (filteredTags.length > 0) {
      result = result.filter((bookmark) =>
        filteredTags.every((ft) =>
          bookmark.tags?.some((tag) => tag.id === ft.id),
        ),
      );
    }

    // 3. Search Filter
    if (searchQuery.trim()) {
    const normalized = searchQuery.toLowerCase();
    result = result.filter((b) =>
      b.title.toLowerCase().includes(normalized),
    );
  }
    

    return result
  }, [bookmarks, filteredTags, page, searchQuery]);

  return (
    <div>
      <ToasterHub />

      <h1 className=" text-2xl font-bold mb-4 text-base-800">
        {filteredTags.length > 0 ? (
          <span>
            Bookmarks tagged:{" "}
            <span>{filteredTags.map((tag) => tag.title).join(", ")}</span>
          </span>
        ) : (
          title
        )}
      </h1>
      {initialLoading && (
        <span className=" loading loading-dots loading-xl"></span>
      )}

      <div className="flex flex-col gap-4 ">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* <div className="flex flex-wrap gap-4"> */}
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </div>
      <EditBookmarkButton key={editBookmark?.id} />
    </div>
  );
}
