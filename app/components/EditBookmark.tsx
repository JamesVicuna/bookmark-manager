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
import { toast } from "react-hot-toast";

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
    if (!editBookmark) throw new Error();
    if (!title || !url || !description) throw new Error();
    const edits: BookmarkInsert = {
      title,
      url,
      description,
    };

    toast.promise(updateBookmark(editBookmark.id, edits, selectedTags), {
      loading: "Editing...",
      success: "Updated!",
      error: "Error updating bookmark...",
    });
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
