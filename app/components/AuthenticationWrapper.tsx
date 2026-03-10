"use client";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useTagsStore } from "../stores/useTagsStore";
import { useBookmarksStore } from "../stores/useBookmarksStore";
import { useFiltersStore } from "../stores/useFilterStore";

export const AuthenticationWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isSignedIn } = useAuth();
  const { fetchTags, clearTags } = useTagsStore();
  const { fetchBookmarks, clearBookmarks } = useBookmarksStore();
  const clearFilteredTags = useFiltersStore((state) => state.clearFilteredTags);

  useEffect(() => {
    if (isSignedIn) {
      fetchTags();
      fetchBookmarks();
    } else {
      clearTags();
      clearFilteredTags();
      clearBookmarks();
    }
  }, [
    isSignedIn,
    fetchTags,
    fetchBookmarks,
    clearTags,
    clearFilteredTags,
    clearBookmarks,
  ]);
  return <>{children}</>;
};
