"use client";

import axios from "axios";
import { Bookmark, Tag, TagInsert, BookmarkInsert } from "./types/bookmarks";
import {
  SignedIn,
  SignInButton,
  SignOutButton,
  UserAvatar,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";

const bookmark: Bookmark = {
  title: "New test",
  description: "test",
};

const bookmarkTest: BookmarkInsert = {
  title: "TESTING HERE",
  description: "I WILL PUT TAGS WITH THIS ONE",
};

export default function Home() {
  const [tag, setTag] = useState<string>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const getAllTags = async () => {
      try {
        const res = await axios.get("/api/tags");

        console.log("TAGS HERE");
        console.log(res.data);

        setTags(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllTags();
  }, []);

  useEffect(() => {
    const getAllBookmarks = async () => {
      try {
        const res = await axios.get("/api/bookmarks");

        const bookmarks: Bookmark[] = res.data;

        setBookmarks(bookmarks);
      } catch (error) {
        console.log(error);
      }
    };

    getAllBookmarks();
  }, []);

  const handleTagUpload = async () => {
    try {
      const res = await axios.post("/api/tags", { title: tag });

      const tagRes: Tag = res.data;
      console.log("tag res here");
      console.log(tagRes);

      setTags((prev) => {
        return [...prev, tagRes];
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = async () => {
    try {
      const data = {
        bookmarkInsert: bookmarkTest,
        tags: tags,
      };

      const res = await axios.post("/api/bookmarks", data);

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <SignInButton>Sign In here</SignInButton>
      <SignedIn>
        <UserAvatar />
        <SignOutButton>Sign out here</SignOutButton>
      </SignedIn>
      <div className="flex flex-col gap-4">
        <div>
          <h1>Tags</h1>
          <div>
            {tags.map((tag) => {
              return <div key={tag.id}>{tag.title}</div>;
            })}
          </div>
          <div>Tag : {tag}</div>
          <textarea onChange={(e) => setTag(e.target.value)}></textarea>
          <button className=" btn btn-accent" onClick={handleTagUpload}>
            Upload Tag
          </button>
        </div>
        <div>
          <button>Upload tag</button>
        </div>

        <div>
          <h1>Bookmarks</h1>
          <button onClick={handleBookmark}>Upload Bookmark</button>
          {bookmarks.map((bookmark) => {
            return (
              <div key={bookmark.id}>
                <h1>{bookmark.title}</h1>
                <p>{bookmark.description}</p>
                {bookmark.tags?.map((tag) => (
                  <div key={`${tag.id} for ${tag.user_id}`} className=" badge badge-accent">
                    {tag.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
