import { create } from "zustand";
import { Bookmark } from "../types/bookmarks";

export interface ModalState {
  editBookmark: Bookmark | null;
  openEditModal: (bookmark: Bookmark) => void;
  closeEditModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  editBookmark: null,
  openEditModal: (bookmark) => {
    set({ editBookmark: bookmark });
  },
  closeEditModal: () => {
    set({ editBookmark: null });
  },
}));
