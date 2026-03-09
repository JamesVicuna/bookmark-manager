import { create } from "zustand";
import { openModal } from "../utils/modal";
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
    openModal("edit")
  },
  closeEditModal: () => {
    set({ editBookmark: null });
  },
}));
