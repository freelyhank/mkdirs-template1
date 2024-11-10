"use client";

import { unsubscribeToNewsletter } from "@/actions/unsubscribe-to-newsletter";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Processing your request...");

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      unsubscribeToNewsletter({ email })
        .then((response) => {
          console.log("unsubscribePage, response", response);
          if (response.status === "success") {
            setMessage(response.message || "You have been unsubscribed.");
          } else {
            setMessage(
              response.message || "An error occurred. Please try again later.",
            );
          }
        })
        .catch(() => {
          console.log("unsubscribePage, error");
          setMessage("An error occurred. Please try again later.");
        });
    } else {
      console.log("unsubscribePage, no email provided");
      setMessage("Invalid request. No email provided.");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Logo className="size-12" />

      <h1 className="text-4xl font-bold">Unsubscribe from the newsletter</h1>

      <p className="text-balance text-center text-xl font-medium px-4">
        {message}
      </p>

      <Button asChild size="lg" variant="default">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
