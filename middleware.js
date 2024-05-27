import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// protecting the routes.
const isProtectedRoute = createRouteMatcher([
   '/',
]);

export default clerkMiddleware((auth, req) => {
   if (isProtectedRoute(req)) auth().protect();
   return NextResponse.next()
});

export const config = {
   matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};