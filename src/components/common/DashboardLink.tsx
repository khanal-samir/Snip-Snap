import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLink() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 group">
      <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors relative">
        <ChevronLeft className="h-4 w-4 absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-left-3 transition-all text-primary" />
        <Image
          src="/logo.svg"
          alt="Snip Snap Logo"
          width={28}
          height={28}
          className="h-7 w-auto"
        />
      </div>
      <h1 className="text-2xl font-bold">
        <span className="text-primary">Snip</span>
        <span>Snap</span>
      </h1>
    </Link>
  );
}
