"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold">
                <span className="text-primary">Vibe</span>Write
              </span>
            </Link>

            {/* Navigation Tabs */}
            <Tabs defaultValue="threads" className="w-auto">
              <TabsList className="bg-transparent h-9">
                <Link href="/" passHref>
                  <TabsTrigger
                    value="threads"
                    className={cn(
                      "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium",
                      isActive("/")
                        ? "border-b-2 border-primary rounded-none"
                        : ""
                    )}
                  >
                    Threads
                  </TabsTrigger>
                </Link>
                <Link href="/sources" passHref>
                  <TabsTrigger
                    value="sources"
                    className={cn(
                      "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium",
                      isActive("/sources")
                        ? "border-b-2 border-primary rounded-none"
                        : ""
                    )}
                  >
                    Sources
                  </TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </div>

          {/* Search Bar */}
          <div className="relative w-[300px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search Threads..."
              className="w-full py-2 pl-10 pr-4 bg-muted/50 border-0 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
