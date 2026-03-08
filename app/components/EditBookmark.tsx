"use client";
import { openModal } from "../utils/modal";
import { useEffect } from "react";
import { useBookmarksStore } from "../stores/useBookmarksStore";
import { BookmarkInsert } from "../types/bookmarks";

import { useModalStore } from "../stores/useModalStore";

import {
  ActionBookmarkModal,
  ActionBookmarkProps,
} from "./ActionBookmarkModal";

export const EditBookmarkButton = () => {
  // Stores
  const { updateBookmark, loading } = useBookmarksStore();
  const { editBookmark, closeEditModal } = useModalStore();

  // Opens the modal if we are selecting a bookmark to edit
  useEffect(() => {
    if (editBookmark) {
      openModal("edit");
    }
  }, [editBookmark]);

  const handleEditBookmark: ActionBookmarkProps["onSubmit"] = async ({
    title,
    url,
    description,
    selectedTags,
  }) => {
    if (!editBookmark) return {success: false};
    if (!title || !url || !description) return {success: false};
    const edits: BookmarkInsert = {
      title,
      url,
      description,
    };

    return await updateBookmark(editBookmark.id, edits, selectedTags);
  };

  return (
    <ActionBookmarkModal
      modalId={"edit"}
      heading={"Edit bookmark"}
      descriptionForm={
        "Update your saved link details - change teh title, descripition,URL, or tags anytime."
      }
      submitLabel={"Save Bookmark"}
      loading={loading}
      initialTags={editBookmark?.tags ?? []}
      initialBookmark={editBookmark || undefined}
      onSubmit={handleEditBookmark}
      onClose={closeEditModal}
    />
  );
};
