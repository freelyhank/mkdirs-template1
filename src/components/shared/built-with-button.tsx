import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function BuiltWithButton() {
  return (
    <Link
      target="_blank"
      href="https://mkdirs.com?utm_source=demo&utm_medium=website&utm_campaign=built-with-mkdirs-button&utm_content=built-with-mkdirs"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "px-4 rounded-md",
      )}
    >
      <span>Built with</span>
      <span>
        <LogoMkdirs className="size-4 rounded-full" />
      </span>
      <span className="font-bold">Mkdirs</span>
    </Link>
  );
}

function LogoMkdirs({ className }: { className?: string }) {
  return (
    <Image
      src="/logo_mkdirs.png"
      alt="Logo"
      title="Logo"
      width={96}
      height={96}
      className={cn("size-8 rounded-md", className)}
    />
  );
}
