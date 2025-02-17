import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto h-screen grid grid-cols-1 sm:grid-cols-2 place-items-center px-4">
      <article className="flex flex-col flex-wrap gap-4 md:gap-8">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl">
          Something is not right...
        </h1>
        <p className="text-muted-foreground text-base sm:text-xl font-light">
          Page you are trying to open does not exist. You may have mistyped the
          address, or the page has been moved to another URL. If you think this
          is an error contact support.
        </p>
        <Link href="/">
          {" "}
          <Button variant="outline" className="border-blue-500">
            Go back to home page
          </Button>
        </Link>
      </article>

      <Image
        src="/404.svg"
        width={500}
        height={500}
        alt="not-found svg"
        className="hidden sm:block w-full h-full"
      />
    </main>
  );
}
