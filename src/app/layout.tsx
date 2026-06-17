import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import { authOptions } from "@/lib/auth";
import { TranslateProvider } from "@/context/TranslateContext";

export default async function RootLayout({ children }) {

  const session = await getServerSession(authOptions);

  return (
    <html>
      <body>
        <div
          className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#f3c326_1px,transparent_1px)] bg-size-[16px_16px]">
        </div>
        <SessionProvider session={session}>
          <TranslateProvider>
            <Navbar/>
            { children }
          </TranslateProvider>
        </SessionProvider>
      </body>
    </html>
  )
}