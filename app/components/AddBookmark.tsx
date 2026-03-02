"use client";
import { openModal } from "../utils/modal";
import { Modal } from "./Modal";

export const AddBookmarkButton = () => {
  return (
    <div>
      <button
        className="btn btn-primary text-base-100 rounded-lg"
        onClick={() => openModal()}
      >
        + Add Bookmark
      </button>
      <Modal>
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className=" font-semibold text-2xl text-black mb-0.5">
              Add a bookmark
            </h1>
            <p className="text-sm">
              Save a link with details to keep your collection organized. We
              extract the favicon automatically from the URL.
            </p>
          </div>
          <label htmlFor="title">Title*</label>
          <textarea id="title"></textarea>
          <label htmlFor="description">Description*</label>
          <textarea id="description"></textarea>
          <label htmlFor="url">Website URL*</label>
          <textarea id="url"></textarea>
          <label htmlFor="tags">Tags*</label>
          <textarea id="tags"></textarea>
        </div>
      </Modal>
    </div>
  );
};
