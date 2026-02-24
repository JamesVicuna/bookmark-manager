import { auth } from "@clerk/nextjs/server";
import { BookmarkService } from "./bookmark-service";
import { UnauthorizedError } from "./errors";

interface AuthenticatedService {
   userId: string,
   bookmarkService: BookmarkService
}

export async function getAuthenticatedService(): Promise<AuthenticatedService> {
   const { userId} = await auth()

   if (!userId) throw new UnauthorizedError()

   const bookmarkService = await BookmarkService.init()

   return {userId, bookmarkService}
}