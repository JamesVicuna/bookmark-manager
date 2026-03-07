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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapBookmarkFromDatbase(data: any): Bookmark {
    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      url: data.url,
      favicon: data.favicon,
      description: data.description,
      pinned: data.pinned,
      is_archived: data.is_archived,
      visit_count: data.visit_count,
      created_at: data.created_at,
      last_visited: data.visited_at,
    };
  }

  async createBookmark(
    bookmark: BookmarkInsert,
    tags?: Tag[],
  ): Promise<Bookmark> {
    console.log("========bookmark insert here=====")
    console.log(bookmark)
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
    const { data, error } = await this.supabase
      .from("tags")
      .insert(tag)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);

    return data as Tag;
  }

  async getAllTags(): Promise<Tag[]> {
    const { data, error } = await this.supabase
      .from("tags")
      .select("*, bookmark_tags(count)");

    const tags = data?.map((tag) => ({
      ...tag,
      count: tag.bookmark_tags[0].count,
    }));

    if (error) throw new DatabaseError(error.message);

    return tags as Tag[];
  }

  async deleteTag(id: string) {
    const { error } = await this.supabase.from("tags").delete().eq("id", id);

    if (error) throw new DatabaseError(error.message);
  }

  async getBookmarkWithTags(id: string): Promise<Bookmark> {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .select(
        `
         *,
         bookmark_tags(
            tag: tags(*)
         )
         `,
      )
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);

    return {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: data.bookmark_tags.map((tag: any) => tag.tag),
    } as Bookmark;
  }

  async getAllBookmarksWithTags() {
    const { data, error } = await this.supabase.from("bookmarks").select(
      `*,
      bookmark_tags(
         tag: tags(*)
      )
      `,
    );

    if (error) return new DatabaseError(error.message);

    return data.map((bookmark) => ({
      ...this.mapBookmarkFromDatbase(bookmark),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: bookmark.bookmark_tags.map((bookmark_tag: any) => bookmark_tag.tag),
    }));
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw new DatabaseError(error.message);

    return data as Bookmark[];
  }

  async getBookmarkTags(bookmarkId: string) {
    const { data, error } = await this.supabase
      .from("bookmark_tags")
      .select("*")
      .eq("bookmark_id", bookmarkId);

    if (error) throw new DatabaseError(error.message);
  }

  async postBookmarkTags(bookmarkId: string, tags: Tag[]) {
    const { error } = await this.supabase.from("bookmark_tags").insert(
      tags.map((tag) => ({
        tag_id: tag.id,
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
