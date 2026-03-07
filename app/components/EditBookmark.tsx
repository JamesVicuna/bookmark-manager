"use client";
import { openModal } from "../utils/modal";
import { Modal } from "./Modal";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useBookmarksStore } from "../stores/useBookmarksStore";
import { Bookmark, BookmarkInsert, Tag } from "../types/bookmarks";
import { useTagsStore } from "../stores/useTagsStore";
import { useModalStore } from "../stores/useModalStore";

export const EditBookmarkButton = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const { editBookmark, closeEditModal } = useModalStore();
  const tags = useTagsStore((state) => state.tags);

  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    editBookmark?.tags ?? [],
  );
  const updateBookmark = useBookmarksStore((state) => state.updateBookmark);
  console.log("Selected tags here for edit");
  console.log(selectedTags);

  const toggleSelectedTags = (tag: Tag) => {
    const updatedTags = selectedTags.some((t) => t.id === tag.id)
      ? selectedTags.filter((t) => t.id !== tag.id)
      : [...selectedTags, tag];

    setSelectedTags(updatedTags);
  };

  const handleEditBookmark = async () => {
    if (!editBookmark) return;
    const edits: BookmarkInsert = {
      title: "Bookmark Insert Test",
      url: "/testing",
      description: "Testing for the bookmark insert",
      favicon: "/hellogovna",
    };

    await updateBookmark(editBookmark.id, edits);
  };
  return (
    <div>
      <Modal id="edit">
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className=" font-semibold text-2xl text-black mb-0.5">
              Edit bookmark
            </h1>
            <p className="text-sm">
              Update your saved link details - change teh title, descripition,
              URL, or tags anytime.
            </p>
          </div>
          <label htmlFor="title" className="mb-1">
            Title*
          </label>
          <input
            id="title"
            type="text"
            className="input outline-none w-full mb-4"
          />
          <label htmlFor="description" className="mb-1">
            Description*
          </label>
          <textarea
            id="description"
            rows={3}
            className=" textarea outline-none w-full mb-4"
          />
          <label htmlFor="url" className="mb-1">
            Website URL*
          </label>
          <input
            id="url"
            type="text"
            className="input outline-none w-full mb-4"
          />
          <label htmlFor="tags" className="mb-1">
            Tags*
          </label>
          {/* <input id="tags" type="text" className="input w-full mb-4" /> */}
          <form className="flex gap-2 mb-2">
            {tags.map((tag) => (
              <input
                key={tag.id}
                className="btn btn-xs "
                type="checkbox"
                name="tags"
                aria-label={tag.title}
                onChange={() => toggleSelectedTags(tag)}
                checked={selectedTags.some((t) => t.id === tag.id)}
              />
            ))}
          </form>
          <div className="flex gap-1">
            <input
              type="text"
              className="input input-sm w-28 outline-none"
              placeholder="New Tag"
            />
            <button className="btn btn-sm">
              <Image
                src={"/images/icon-add.svg"}
                width={20}
                height={20}
                alt="+"
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex gap-4">
            <form method="dialog">
              <button
                className="btn bg-base-100 border-base-300 border-2 font-semibold text-base-900 rounded-lg"
                onClick={closeEditModal}
              >
                Cancel
              </button>
            </form>
            <button
              className="btn btn-primary rounded-lg"
              onClick={handleEditBookmark}
            >
              Save Bookmark
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
