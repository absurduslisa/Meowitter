import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import { User } from "@/models/User";

const f = createUploadthing();

export const ourFileRouter = {
  avatar: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) throw new Error("Not authorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await connectToDB();
      await User.findByIdAndUpdate(metadata.userId, { avatar: file.ufsUrl });
      return { url: file.ufsUrl };
    }),

  postImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) throw new Error("Not authorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
