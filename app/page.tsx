"use client";

import {
  SignedIn,
  SignInButton,
  SignOutButton,
  UserAvatar,
} from "@clerk/nextjs";
import { BookmarkCard } from "./components/BookmarkCard";
import { useBookmarksStore } from "./stores/useBookmarksStore";
import { useTagsStore } from "./stores/useTagsStore";
import { useMemo } from "react";
import { EditBookmarkButton } from "./components/EditBookmark";
import { useModalStore } from "./stores/useModalStore";

export default function Home() {
  const filteredTags = useTagsStore((state) => state.filteredTags);
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const editBookmark = useModalStore((state) => state.editBookmark)

  const filteredBookmarks = useMemo(
    () =>
      filteredTags.length > 0
        ? bookmarks.filter((bookmark) =>
            filteredTags.every((ft) =>
              bookmark.tags?.some((tag) => tag.id === ft.id),
            ),
          )
        : bookmarks,
    [bookmarks, filteredTags],
  );

  return (
    <div>
      <SignInButton>Sign In here</SignInButton>
      <SignedIn>
        <UserAvatar />
        <SignOutButton>Sign out here</SignOutButton>
      </SignedIn>
      <div className="flex flex-col gap-4 lg:w-4/5">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </div>
      <EditBookmarkButton key={editBookmark?.id}/>
    </div>
  );
}
