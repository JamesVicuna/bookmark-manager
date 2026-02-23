import { auth } from "@clerk/nextjs/server";
import { BookmarkService } from "./bookmark-service";

interface AuthenticatedService {
   userId: string,
   bookmarkService: BookmarkService
}

export async function getAuthenticatedService(): Promise<AuthenticatedService> {
   const { userId} = await auth()

   if (!userId) throw Error("Unauthorized")

   const bookmarkService = await BookmarkService.init()

   return {userId, bookmarkService}
}