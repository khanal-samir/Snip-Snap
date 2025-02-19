import RegisterForm from "@/components/auth/register-form";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/logo.svg"
              width={50}
              height={50}
              alt="logo"
              priority
              className="w-fit h-fit"
            />
            Snip Snap
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image src="/Hero.svg" fill priority alt="hero-1" />
      </div>
    </div>
  );
}
