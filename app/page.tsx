"use client";

import axios from "axios";
import { Bookmark } from "./types/bookmarks";
import { SignInButton } from "@clerk/nextjs";

const bookmark: Bookmark = {
  title: "New test",
  description: "test",
};

export default function Home() {
  const handleTagUpload = async () => {
    try {
      const res = await axios.post("/api/tags", bookmark);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <SignInButton>Sign In here</SignInButton>
      <button className=" btn btn-accent" onClick={handleTagUpload}>Hello </button>
      <div>
        <button>Upload tag</button>
      </div>
    </div>
  );
}
