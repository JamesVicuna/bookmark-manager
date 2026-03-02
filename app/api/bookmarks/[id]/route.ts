import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/lib/api-response";
import { getAuthenticatedService } from "@/app/lib/with-service";
import { Bookmark } from "@/app/types/bookmarks";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { bookmarkService } = await getAuthenticatedService();
    const { id } = await params;

    const bookmark = await bookmarkService.getBookmarkWithTags(id);

    return NextResponse.json(bookmark);
  } catch (error) {
    handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { bookmarkService } = await getAuthenticatedService();
    const { id } = await params;
    const data: Omit<Partial<Bookmark>, "created_at" | "user_id" | "id" | "visit_count"> = await request.json();

    const bookmark = await bookmarkService.editBookmark(id, data);

    return NextResponse.json(bookmark);
  } catch (error) {
    handleError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { bookmarkService } = await getAuthenticatedService();
    const { id } = await params;

    await bookmarkService.deleteBookmark(id);
  } catch (error) {
    handleError(error);
  }
}
