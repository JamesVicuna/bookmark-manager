import { Bookmark, BookmarkInsert, Tag, TagInsert } from "../types/bookmarks";
import { DatabaseError } from "./errors";
import { createSupabaseClient } from "./supabase";
import { type SupabaseClient } from "@supabase/supabase-js";

export class BookmarkService {
  private supabase: SupabaseClient;
  private constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  static async init(): Promise<BookmarkService> {
    const supabase = await createSupabaseClient();
    return new BookmarkService(supabase);
  }

  async createBookmark(
    bookmark: BookmarkInsert,
    tags?: string[],
  ): Promise<Bookmark> {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .insert(bookmark)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);

    if (tags?.length) {
      await this.postBookmarkTags(data.id, tags);
    }

    return data as Bookmark;
  }

  async createTag(tag: TagInsert) {
    const { error } = await this.supabase
      .from("tags")
      .insert(tag)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
  }

  async getTags(): Promise<Tag[]> {
    const { data, error } = await this.supabase.from("tags").select("*");

    if (error) throw new DatabaseError(error.message);

    return data as Tag[];
  }

  async deleteTag(id: string) {
    const { error } = await this.supabase.from("tags").delete().eq("id", id);

    if (error) throw new DatabaseError(error.message);
  }

  async getBookmark(id: string): Promise<Bookmark> {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data as Bookmark;
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .select("*")
      .order("createdAt", { ascending: true });

    if (error) throw new DatabaseError(error.message);

    return data as Bookmark[];
  }

  async postBookmarkTags(bookmarkId: string[], tagIds: string[]) {
    const { error } = await this.supabase.from("bookmark_tags").insert(
      tagIds.map((tagId) => ({
        tag_id: tagId,
        bookmark_id: bookmarkId,
      })),
    );

    if (error) throw new DatabaseError(error.message);
  }

  async editBookmark(id: string, edits: Partial<Bookmark>): Promise<Bookmark> {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .update(edits)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);

    return data as Bookmark;
  }

  async deleteBookmark(bookmarkId: string) {
    const { error } = await this.supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId);

    if (error) throw new DatabaseError(error.message);
  }
}
