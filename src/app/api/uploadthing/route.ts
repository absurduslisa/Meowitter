import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { createUploadthing } from "uploadthing/next";


export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});