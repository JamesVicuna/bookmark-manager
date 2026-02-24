import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedService } from "@/app/lib/with-service";
import { handleError } from "@/app/lib/api-response";
import { Tag, TagInsert } from "@/app/types/bookmarks";

export async function GET() {
  // get all the tags
  try {
    const { bookmarkService } = await getAuthenticatedService();

    const tags = await bookmarkService.getAllTags();

    return NextResponse.json(tags);
  } catch (error) {
    handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bookmarkService } = await getAuthenticatedService();
    const data: TagInsert = await request.json();

    const tag = await bookmarkService.createTag(data);

    console.log(tag)

    return NextResponse.json(tag);
  } catch (error) {
    handleError(error);
  }
}

export async function DELETE() {}
