import axios from "axios";
import { Bookmark } from "../types/bookmarks";
import { create } from "zustand";

interface BookmarksState {
  bookmarks: Bookmark[];
  fetchBookmarks: () => Promise<void>;
}

export const useBookmarksStore = create<BookmarksState>((set) => ({
  bookmarks: [],
  fetchBookmarks: async () => {
    try {
      const res = await axios.get("/api/bookmarks");

      const bookmarks: Bookmark[] = res.data;

      set({ bookmarks: bookmarks });
    } catch (error) {
      console.log(error)
    }
  },
}));
