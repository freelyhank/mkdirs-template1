import { Icons } from "@/components/icons/icons";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Button } from "@/components/ui/button";
import { footerConfig } from "@/config/footer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type * as React from "react";
import Container from "../container";
import { Logo } from "../logo";
import BuiltWithButton from "../shared/built-with-button";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <Container className="grid grid-cols-2 gap-8 py-12 md:grid-cols-6">
        <div className="flex flex-col items-start col-span-full md:col-span-2">
          <div className="space-y-4">
            <div className="items-center space-x-2 flex">
              <Logo />

              <span className="text-xl font-bold">{siteConfig.name}</span>
            </div>

            <p className="text-muted-foreground text-base p4-4 md:pr-12">
              {siteConfig.tagline}
            </p>

            <div className="flex items-center gap-1">
              {siteConfig.links.github && (
                <Button variant="ghost" size="sm" className="size-8 px-0">
                  <Link
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icons.github className="size-5" />
                  </Link>
                </Button>
              )}
              {siteConfig.links.twitter && (
                <Button variant="ghost" size="sm" className="size-8 px-0">
                  <Link
                    href={siteConfig.links.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icons.twitter className="size-5" />
                  </Link>
                </Button>
              )}
              {siteConfig.links.youtube && (
                <Button variant="ghost" size="sm" className="size-8 px-0">
                  <Link
                    href={siteConfig.links.youtube}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icons.youtube className="size-5" />
                  </Link>
                </Button>
              )}
              {siteConfig.mail && (
                <Button variant="ghost" size="sm" className="size-8 px-0">
                  <Link
                    href={`mailto:${siteConfig.mail}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icons.email className="size-5" />
                  </Link>
                </Button>
              )}
            </div>

            <BuiltWithButton />
          </div>
        </div>

        {footerConfig.links.map((section) => (
          <div
            key={section.title}
            className="col-span-1 md:col-span-1 items-start"
          >
            <span className="text-sm font-semibold uppercase">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t py-4">
        <Container className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Copyright &copy; {new Date().getFullYear()} All Rights Reserved.
          </span>

          <div className="flex items-center gap-3">
            <ModeToggle />
          </div>
        </Container>
      </div>
    </footer>
  );
}
