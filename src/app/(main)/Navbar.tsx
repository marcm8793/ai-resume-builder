"use client";

import logo from "@/assets/logo.svg";
import ThemeToggle from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { CreditCard, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import FeedbackModal from "@/components/feedback/FeedbackModal";
import useFeedbackModal from "@/hooks/useFeedbackModal";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme } = useTheme();
  const { setOpen: setFeedbackOpen } = useFeedbackModal();
  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    // Check if system theme is dark
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setSystemIsDark(isDark);
    }
  }, []);

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <Link href="/resumes" className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={35} height={35} className="" />
          <span className="text-xl font-bold tracking-tight">
            Boring Resume
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton
            appearance={{
              baseTheme:
                theme === "dark" || (theme === "system" && systemIsDark)
                  ? dark
                  : undefined,
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
              <UserButton.Action
                label="Feedback"
                labelIcon={<MessageSquare className="size-4" />}
                onClick={() => setFeedbackOpen(true)}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
      <FeedbackModal />
    </header>
  );
}
