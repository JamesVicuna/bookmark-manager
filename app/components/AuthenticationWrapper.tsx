"use client";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useTagsStore } from "../stores/useTagsStore";
import { useBookmarksStore } from "../stores/useBookmarksStore";

export const AuthenticationWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isSignedIn } = useAuth();
  const fetchTags = useTagsStore((state) => state.fetchTags);
  const fetchBookmarks = useBookmarksStore((state) => state.fetchBookmarks);
  const clearTags = useTagsStore((state) => state.clearTags);
  const clearFilteredTags = useTagsStore((state) => state.clearFilteredTags);
  const clearBookmarks = useBookmarksStore((state) => state.clearBookmarks);

  useEffect(() => {
    if (isSignedIn) {
      fetchTags();
      fetchBookmarks();
    } else {
      clearTags();
      clearFilteredTags();
      clearBookmarks();
    }
  }, [isSignedIn, fetchTags, fetchBookmarks, clearTags, clearFilteredTags, clearBookmarks]);
  return <>{children}</>;
};
