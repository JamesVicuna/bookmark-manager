import { create } from "zustand";
import axios from "axios";
import { Tag } from "../types/bookmarks";

interface TagsState {
  tags: Tag[];
  filteredTags: Tag[];
  isLoading: boolean;
  error: string | null;
  toggleFilteredTag: (tag: Tag) => void;
  fetchTags: () => Promise<void>;
  clearTags: () => void;
  clearFilteredTags: () => void;
}

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  filteredTags: [],
  isLoading: false,
  error: null,
  toggleFilteredTag: (tag) => {
    set((state) => ({
      filteredTags: state.filteredTags.some(
        (filteredTag) => filteredTag.id === tag.id, // check if filteredTags array has the current tag
      )
        ? state.filteredTags.filter((filterTag) => filterTag.id !== tag.id) // Does : remove tag
        : [...state.filteredTags, tag], //Doesnt: add tag
    }));
  },
  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/api/tags");

      const tags: Tag[] = res.data;
      set({ tags, isLoading: false });
    } catch (err) {
      console.log(err)
      set({ error: "Error fetching tags", isLoading: false });
    }
  },
  clearTags: () => {
    set({ tags: [] });
  },
  clearFilteredTags: () => {
    set({filteredTags: []})
  }
}));
