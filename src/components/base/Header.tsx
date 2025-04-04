import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme";
import Link from "next/link";

export default function Header() {
  return (
    <header className="h-14 flex justify-between items-center p-10">
      <div className="flex gap-4 items-center">
        <Image
          src="/logo.svg"
          width={100}
          height={100}
          priority
          alt="logo"
          className="w-fit"
        />
        <h1 className="font-bold">
          {" "}
          <span className="text-primary">Snip</span>
          <span>Snap</span>
        </h1>
      </div>

      <section className="flex justify-center items-center gap-4">
        <ThemeToggle />
        <Link href="/login">
          {" "}
          <Button className="border-blue-600 font-bold" variant="outline">
            Login
          </Button>
        </Link>
      </section>
    </header>
  );
}
