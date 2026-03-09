import { create } from "zustand";

interface PageState {
  page: Pages;
  setPage: (page: Pages) => void;
}

export enum Pages {
  ALL = "all",
  ARCHIVED = "archived",
}

export const usePageStore = create<PageState>((set) => ({
  page: Pages.ALL,
  setPage: (page) => {
    set({ page: page });
  },
}));
