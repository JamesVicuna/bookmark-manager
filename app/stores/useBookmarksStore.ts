import axios from "axios";
import { Bookmark } from "../types/bookmarks";
import { create } from "zustand";

export interface BookmarksState {
  bookmarks: Bookmark[];
  fetchBookmarks: () => Promise<void>;
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
