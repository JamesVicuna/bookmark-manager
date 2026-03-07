import axios from "axios";
import { Bookmark, BookmarkInsert, Tag } from "../types/bookmarks";
import { create } from "zustand";
import { useTagsStore } from "./useTagsStore";

export interface BookmarksState {
  bookmarks: Bookmark[];
  fetchBookmarks: () => Promise<void>;
  addBookmark: (bookmarkInsert: BookmarkInsert, tags: Tag[]) => Promise<void>
  updateBookmark: (id: string, updates: Partial<Bookmark>) => Promise<void>;
  clearBookmarks: () => void;
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  fetchBookmarks: async () => {
    try {
      const res = await axios.get("/api/bookmarks");

      const bookmarks: Bookmark[] = res.data;

      set({ bookmarks: bookmarks });
    } catch (error) {
      console.log(error);
    }
  },
  addBookmark: async (bookmarkInsert, tags) => {
    try {
      console.log(bookmarkInsert)
      await axios.post("/api/bookmarks", {bookmarkInsert, tags})
      const fetchBookmarks = get().fetchBookmarks;
      await fetchBookmarks()
      await useTagsStore.getState().fetchTags()
    } catch (error) {
      console.log(error)
      console.error("error uploading bookmark")
    }
  },
  updateBookmark: async (id, updates) => {
    try {
      await axios.patch(`/api/bookmarks/${id}`, { updates });
      const fetchBookmarks = get().fetchBookmarks;
      await fetchBookmarks();
    } catch (error) {
      console.log(error);
      console.log("Error updating bookmark with edits: ", updates);
    }
  },
  clearBookmarks: () => {
    set({ bookmarks: [] });
  },
}));
