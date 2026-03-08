"use client";

import {  useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Modal } from "./Modal";
import { useTagsStore } from "../stores/useTagsStore";
import { Bookmark, Tag, TagInsert } from "../types/bookmarks";

export type ActionBookmarkProps = {
  modalId: string;
  heading: string;
  descriptionForm: string;
  submitLabel: string;
  loading: boolean;
  initialBookmark?: Bookmark;
  initialTags: Tag[];
  onSubmit: (fields: {
    title: string;
    description: string;
    url: string;
    selectedTags: Tag[];
  }) => Promise<{ success: boolean }>;
  onClose: () => void;
};

export const ActionBookmarkModal = ({
  modalId,
  heading,
  descriptionForm,
  submitLabel,
  loading,
  initialBookmark,
  initialTags,
  onSubmit,
  onClose,
}: ActionBookmarkProps) => {
  // Stores
  //   const { updateBookmark, loading } = useBookmarksStore();
  const { tags, fetchTags } = useTagsStore();

  // Form states
  const [title, setTitle] = useState<string>(
    initialBookmark ? initialBookmark.title : "",
  );
  const [description, setDescription] = useState<string>(
    initialBookmark ? initialBookmark.description : "",
  );
  const [url, setUrl] = useState<string>(
    initialBookmark ? initialBookmark.url : "",
  );
  const [newTag, setNewTag] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags);

  const [loadingNewTagUpload, setLoadingNewTagUpload] =
    useState<boolean>(false);

  const toggleSelectedTags = (tag: Tag) => {
    const updatedTags = selectedTags.some((t) => t.id === tag.id)
      ? selectedTags.filter((t) => t.id !== tag.id)
      : [...selectedTags, tag];

    setSelectedTags(updatedTags);
  };

  const handleNewTag = async () => {
    const title = newTag.trim().replace(/\s+/g, " ");
    if (title.length === 0) {
      return;
    }

    setLoadingNewTagUpload(true);

    const tagInsert: TagInsert = { title };

    try {
      await axios.post("/api/tags", tagInsert);
      await fetchTags();
      setNewTag("");
    } catch (error) {
      console.log(error);
      console.error("error adding new tag");
    } finally {
      setLoadingNewTagUpload(false);
    }
  };

  const handleSubmit = async () => {
    const res = await onSubmit({
      title,
      description,
      url,
      selectedTags,
    });
    if (res.success) {
      const modal = document.getElementById(
        modalId,
      ) as HTMLDialogElement | null;
      modal?.close();
      onClose();
      setTitle("");
      setDescription("");
      setUrl("");
      setSelectedTags([]);
    }
  };

  return (
    <div>
      <Modal id={modalId}>
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className=" font-semibold text-2xl text-black mb-0.5">
              {heading}
            </h1>
            <p className="text-sm">{descriptionForm}</p>
          </div>
          <label htmlFor="title" className="mb-1">
            Title*
          </label>
          <input
            id="title"
            type="text"
            className="input outline-none w-full mb-4"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <label htmlFor="description" className="mb-1">
            Description*
          </label>
          <textarea
            id="description"
            rows={3}
            className=" textarea outline-none w-full mb-4"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <label htmlFor="url" className="mb-1">
            Website URL*
          </label>
          <input
            id="url"
            type="text"
            className="input outline-none w-full mb-4"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <label htmlFor="tags" className="mb-1">
            Tags*
          </label>
          {/* <input id="tags" type="text" className="input w-full mb-4" /> */}
          <form className="flex flex-wrap gap-2 mb-2">
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
              onChange={(e) => setNewTag(e.target.value)}
              value={newTag}
            />
            <button className="btn btn-sm" onClick={handleNewTag}>
              {loadingNewTagUpload ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Image
                  src={"/images/icon-add.svg"}
                  width={20}
                  height={20}
                  alt="+"
                />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex gap-4">
            <form method="dialog">
              <button className="btn bg-base-100 border-base-300 border-2 font-semibold text-base-900 rounded-lg">
                Cancel
              </button>
            </form>
            <button
              className="btn btn-primary rounded-lg"
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
