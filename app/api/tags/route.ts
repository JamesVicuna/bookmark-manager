import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/app/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { getAuthenticatedService } from "@/app/lib/with-service";
import { BookmarkInsert } from "@/app/types/bookmarks";

export async function POST(req: NextRequest) {
  const bookmarkData: BookmarkInsert = await req.json();

  const { bookmarkService } = await getAuthenticatedService();

  try {
    // const bookmark = await bookmarkService.createBookmark(bookmarkData)
    const bookmark = await bookmarkService.editBookmark(
      "37809582-99ef-4012-a6be-eb202a6376ef",
      { url: "this is an update to url", title: "new title update" },
    );

    return NextResponse.json(bookmark);
  } catch (error) {
    return NextResponse.json({ message: "error occurred" });
  }
}
