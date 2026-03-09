"use client";

import { BookmarkCard } from "./components/BookmarkCard";
import { useBookmarksStore } from "./stores/useBookmarksStore";
import { useTagsStore } from "./stores/useTagsStore";
import { useMemo } from "react";
import { EditBookmarkButton } from "./components/EditBookmark";
import { useModalStore } from "./stores/useModalStore";
import { usePageStore, Pages } from "./stores/usePageStore";
import { ToasterHub } from "./components/Toaster";

export default function Home() {
  const filteredTags = useTagsStore((state) => state.filteredTags);
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const editBookmark = useModalStore((state) => state.editBookmark);
  // const [pageState, setPageState] = useState<PageState>("all");
  const page = usePageStore((state) => state.page);
  const titles: Record<Pages, string> = {
    [Pages.ALL]: "All Bookmarks",
    [Pages.ARCHIVED]: "Archived",
  };
  const title = titles[page];

  const filteredBookmarks = useMemo(() => {
    let preFiltredBookmarks = bookmarks;

    switch (page) {
      case Pages.ARCHIVED:
        preFiltredBookmarks = preFiltredBookmarks.filter(
          (bookmark) => bookmark.is_archived,
        );
        break;
      case Pages.ALL:
        preFiltredBookmarks = preFiltredBookmarks.filter(
          (bookmark) => !bookmark.is_archived,
        );
        break;
      default:
        break;
    }

    return filteredTags.length > 0
      ? preFiltredBookmarks.filter((bookmark) =>
          filteredTags.every((ft) =>
            bookmark.tags?.some((tag) => tag.id === ft.id),
          ),
        )
      : preFiltredBookmarks;
  }, [bookmarks, filteredTags, page]);

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
      <div className="flex flex-col gap-4 lg:w-4/5">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </div>
      <EditBookmarkButton key={editBookmark?.id} />
    </div>
  );
}
