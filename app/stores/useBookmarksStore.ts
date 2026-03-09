import axios from "axios";
import { Bookmark, BookmarkInsert, Tag } from "../types/bookmarks";
import { create } from "zustand";
import { useTagsStore } from "./useTagsStore";

export interface BookmarksState {
  bookmarks: Bookmark[];
  loading: boolean;
  fetchBookmarks: () => Promise<void>;
  addBookmark: (bookmarkInsert: BookmarkInsert, tags: Tag[]) => Promise<void>;
  updateBookmark: (
    id: string,
    updates: Partial<Bookmark>,
    tags?: Tag[],
  ) => Promise<void>;
  clearBookmarks: () => void;
  deleteBookmark: (id: string) => Promise<void>;
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  loading: false,
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
    set({ loading: true });
    try {
      await axios.post("/api/bookmarks", { bookmarkInsert, tags });
      const fetchBookmarks = get().fetchBookmarks;
      await fetchBookmarks();
      await useTagsStore.getState().fetchTags();
    } catch (error) {
      console.log(error);
      console.error("error uploading bookmark");
      throw new Error("Error adding bookmark");
    } finally {
      set({ loading: false });
    }
  },
  updateBookmark: async (id, edits, tags) => {
    set({ loading: true });
    try {
      await axios.patch(`/api/bookmarks/${id}`, { edits, tags });
      const fetchBookmarks = get().fetchBookmarks;
      // fectching bookmarks
      console.log("fetching bookmarks");
      await fetchBookmarks();
      await useTagsStore.getState().fetchTags();
    } catch (error) {
      console.log(error);
      console.log("Error updating bookmark with edits: ", edits);
      throw new Error("Error updating bookmarks with edits");
    } finally {
      set({ loading: false });
    }
  },
  clearBookmarks: () => {
    set({ bookmarks: [] });
  },
  deleteBookmark: async (id) => {
    try {
      await axios.delete(`/api/bookmarks/${id}`);
      const fetchBookmarks = get().fetchBookmarks;
      // fectching bookmarks
      console.log("fetching bookmarks");
      await fetchBookmarks();
      await useTagsStore.getState().fetchTags();
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting bookmark");
    }
  },
}));
