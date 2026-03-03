import { create } from "zustand";
import { Tag } from "../types/bookmarks";
import axios from "axios";

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
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
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
