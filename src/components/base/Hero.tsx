import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 place-items-center">
      <section className="flex flex-col flex-wrap gap-4">
        <h1 className="font-bold text-3xl md:text-5xl lg:text-7xl">
          Snip Snap
        </h1>
        <p className="text-muted-foreground text-base sm:text-xl lg:text-2xl font-light">
          Collaborative snippet sharing app
          <br /> Just SnipSnap it to me.
        </p>
        <Button className="w-fit font-bold">Get Started</Button>
      </section>

      <Image
        src="/Hero.svg"
        width={500}
        height={500}
        alt="hero-1"
        className="hidden sm:block lg:w-full lg:h-full"
      />
    </div>
  );
}
