import { Bookmark } from "../types/bookmarks";


interface BookmarksState {
   bookmarks: Bookmark[],
   fetchBookmarks: () => Promise<void>
   

}