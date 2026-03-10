import { create } from "zustand";
import axios from "axios";
import { Tag } from "../types/bookmarks";

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  clearTags: () => void;
}

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  isLoading: false,
  error: null,
  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/api/tags");

      const tags: Tag[] = res.data;
      set({ tags, isLoading: false });
    } catch (err) {
      console.log(err);
      set({ error: "Error fetching tags", isLoading: false });
    }
  },
  clearTags: () => {
    set({ tags: [] });
  },
}));
