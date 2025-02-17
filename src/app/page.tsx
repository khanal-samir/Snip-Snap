import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      hello
      <Button>Hello</Button>
      <Image src="/Hero.png" width={500} height={500} alt="Logo" />
      <ThemeToggle />
    </div>
  );
}
