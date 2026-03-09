"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Modal } from "./Modal";
import { useTagsStore } from "../stores/useTagsStore";
import { Bookmark, Tag, TagInsert } from "../types/bookmarks";
import { isValidDomain } from "../utils/vaildateDomain";

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
  }) => Promise<void>;
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
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState<string>(
    initialBookmark ? initialBookmark.description : "",
  );
  const [descriptionError, setDescriptionError] = useState(false);
  const [url, setUrl] = useState<string>(
    initialBookmark ? initialBookmark.url : "",
  );
  const [urlError, setUrlError] = useState(false);
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

  const checkFields = () => {
    let valid = true;
    if (!title.length) {
      setTitleError(true);
      valid = false;
    }
    if (!description.length || description.length > 280) {
      setDescriptionError(true);
      valid = false;
    }

    if (!url.length || !isValidDomain(url)) {
      setUrlError(true);
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async () => {
    const validCheck = checkFields();
    if (!validCheck) return;

    try {
      await onSubmit({
        title,
        description,
        url,
        selectedTags,
      });

      const modal = document.getElementById(
        modalId,
      ) as HTMLDialogElement | null;
      modal?.close();
      onClose();
      setTitle("");
      setDescription("");
      setUrl("");
      setSelectedTags([]);
    } catch (error) {
      console.log(error);
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
          <div className="mb-4">
            <input
              id="title"
              type="text"
              className={`input outline-none w-full ${titleError && "input-error"} `}
              onBlur={(e) => {
                if (!e.target.value.trim().length) {
                  setTitleError(true);
                } else {
                  setTitle(e.target.value.trim());
                  setTitleError(false);
                }
              }}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
            />
            {titleError && (
              <div className=" text-error text-sm">
                Must enter a valid title
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="mb-1">
              Description*
            </label>
            <textarea
              id="description"
              rows={3}
              className={`textarea outline-none w-full ${descriptionError && "textarea-error"}`}
              onBlur={(e) => {
                if (!e.target.value.trim().length) {
                  setDescriptionError(true);
                } else {
                  setDescription(e.target.value.trim());
                  setDescriptionError(false);
                }
              }}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            {descriptionError && (
              <div className=" text-error text-sm">
                Must enter a valid description
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="url" className="mb-1">
              Website URL*
            </label>
            <input
              id="url"
              type="text"
              className={`input outline-none w-full ${urlError && "input-error"}`}
              onBlur={(e) => {
                if (
                  !e.target.value.trim().length ||
                  !isValidDomain(e.target.value.trim())
                ) {
                  setUrlError(true);
                } else {
                  setUrlError(false);
                }
              }}
              onChange={(e) => setUrl(e.target.value.trim())}
              value={url}
            />
            {urlError && (
              <div className=" text-error text-sm">Must enter a valid URL</div>
            )}
          </div>
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
