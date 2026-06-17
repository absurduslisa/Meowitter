export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // "/meowitter",
    "/post/create",
    "/profile/:path*",
  ],
};