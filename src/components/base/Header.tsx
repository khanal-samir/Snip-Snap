import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme";

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
        <h1 className="font-bold">Snip Snap</h1>
      </div>

      <section className="flex justify-center items-center gap-4">
        <ThemeToggle />
        <Button className="border-blue-600 font-bold" variant="outline">
          Login
        </Button>
      </section>
    </header>
  );
}
