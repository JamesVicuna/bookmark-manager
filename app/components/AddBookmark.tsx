"use client";
import { openModal } from "../utils/modal";
import { Modal } from "./Modal";
import { useState } from "react";
import Image from "next/image";

export const AddBookmarkButton = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [tags, setTags] = useState(["React", "java", "typescript"]);
  return (
    <div>
      <button
        className="btn btn-primary text-primary-content rounded-lg"
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
          <label htmlFor="title" className="mb-1">
            Title*
          </label>
          <input id="title" type="text" className="input outline-none w-full mb-4" />
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
          <input id="url" type="text" className="input outline-none w-full mb-4" />
          <label htmlFor="tags" className="mb-1">
            Tags*
          </label>
          {/* <input id="tags" type="text" className="input w-full mb-4" /> */}
          <form className="flex gap-2 mb-2">
            {tags.map((tag) => (
              <input
                key={tag}
                className="btn btn-xs "
                type="checkbox"
                name="tags"
                aria-label={tag}
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
              <button className="btn bg-base-100 border-base-300 border-2 font-semibold text-base-900 rounded-lg">
                Cancel
              </button>
            </form>
            <button className="btn btn-primary rounded-lg">Add Bookmark</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
