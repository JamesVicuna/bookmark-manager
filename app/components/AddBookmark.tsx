"use client";
import { useBookmarksStore } from "../stores/useBookmarksStore";
import { BookmarkInsert } from "../types/bookmarks";
import {
  ActionBookmarkModal,
  ActionBookmarkProps,
} from "./ActionBookmarkModal";
import { toast } from "react-hot-toast";

export const AddBookmarkButton = () => {
  const { addBookmark, loading } = useBookmarksStore();

  const handleAddBookmark: ActionBookmarkProps["onSubmit"] = async ({
    title,
    url,
    description,
    selectedTags,
  }) => {
    const bookmarkInsert: BookmarkInsert = {
      title,
      url,
      description,
    };

    toast.promise(addBookmark(bookmarkInsert, selectedTags), {
      loading: "Adding...",
      success: "Bookmark Added!",
      error: "Error adding bookmark...",
    });
  };

  return (
    <ActionBookmarkModal
      modalId={"add"}
      heading={"Add bookmark"}
      descriptionForm={
        "Save a link with details to keep your collection organized. We extract the favicon automatically from the URL.."
      }
      submitLabel={"Save Bookmark"}
      loading={loading}
      initialTags={[]}
      onSubmit={handleAddBookmark}
      onClose={() => {}}
    />
  );
};
