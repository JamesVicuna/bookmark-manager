import { create } from "zustand";
import { Tag } from "../types/bookmarks";

interface FilterState {
  filteredTags: Tag[];
  searchQuery: string;
  toggleFilteredTag: (tag: Tag) => void;
  clearFilteredTags: () => void;
  setSearchQuery: (query: string) => void
}

export const useFiltersStore = create<FilterState>((set) => ({
  filteredTags: [],
  searchQuery: "",
  toggleFilteredTag: (tag) => {
    set((state) => ({
      filteredTags: state.filteredTags.some(
        (filteredTag) => filteredTag.id === tag.id, // check if filteredTags array has the current tag
      )
        ? state.filteredTags.filter((filterTag) => filterTag.id !== tag.id) // Does : remove tag
        : [...state.filteredTags, tag], //Doesnt: add tag
    }));
  },
  clearFilteredTags: () => {
    set({ filteredTags: [] });
  },
  setSearchQuery: (query) => set({searchQuery: query})
}));
