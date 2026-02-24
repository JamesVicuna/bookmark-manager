import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedService } from "@/app/lib/with-service";
import { handleError } from "@/app/lib/api-response";
import { BookmarkInsert, Tag } from "@/app/types/bookmarks";

export async function GET() {
  const { bookmarkService } = await getAuthenticatedService();

  try {
    const bookmarks = await bookmarkService.getAllBookmarksWithTags();

    return NextResponse.json(bookmarks);
  } catch (error) {
    handleError(error);
  }
}

export async function POST(req: NextRequest) {
  // post the bookmark, need to get the service

  try {
    const { bookmarkService } = await getAuthenticatedService();

    const {
      bookmarkInsert,
      tags,
    }: { bookmarkInsert: BookmarkInsert; tags: Tag[] } = await req.json();

    const bookmark = await bookmarkService.createBookmark(bookmarkInsert, tags);

    return NextResponse.json(bookmark);
  } catch (error) {
    handleError(error);
  }
}
