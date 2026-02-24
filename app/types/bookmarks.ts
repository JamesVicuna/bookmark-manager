

export type Bookmark = {
   id?: string,
   user_id?: string,
   title: string,
   url?: string,
   favicon?: string,
   description: string,
   pinned?: boolean,
   is_archived?: boolean,
   visit_count?: boolean,
   created_at?: string,
   last_visited?: string,
   tags?: Tag[]
}

export type BookmarkInsert = Pick<Bookmark, "user_id" | "title" | "url" | "favicon" | "description">

export type Tag = {
   id?: string,
   user_id?: string,
   title: string,
   created_at?: string
}

export type TagInsert = Pick<Tag, "title">

export type BookmarkTag = {
   bookmark_id: string,
   tag_id: string
}