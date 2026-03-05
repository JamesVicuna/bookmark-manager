"use client";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useTagsStore } from "../stores/useTagsStore";

export const AuthenticationWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isSignedIn } = useAuth();
  const fetchTags = useTagsStore((state) => state.fetchTags);
  const clearTags = useTagsStore((state) => state.clearTags);
  const clearFilteredTags = useTagsStore((state) => state.clearFilteredTags)

  useEffect(() => {
    if (isSignedIn) {
      fetchTags();
    } else {
      clearTags();
      clearFilteredTags();
    }
  }, [isSignedIn, fetchTags, clearTags, clearFilteredTags]);
  return <>{children}</>;
};
