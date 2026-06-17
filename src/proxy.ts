import withAuth from "next-auth/middleware";

export const proxy = withAuth;

export const config = {
  matcher: [
    // "/meowitter",
    "/post/create",
    "/profile/:path*",
  ],
};