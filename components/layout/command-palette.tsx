"use client";

import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, BookOpen, CreditCard, MessageSquare,
  GraduationCap, FileText, PenLine, Mic, CalendarDays,
  BarChart3, Trophy, Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const COMMANDS = [
  {
    group: "Navigate",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Vocabulary", icon: BookOpen, href: "/vocabulary" },
      { label: "Flashcards", icon: CreditCard, href: "/flashcards" },
      { label: "Grammar Academy", icon: GraduationCap, href: "/grammar" },
      { label: "Sentences", icon: MessageSquare, href: "/sentences" },
      { label: "Reading", icon: FileText, href: "/reading" },
      { label: "Writing", icon: PenLine, href: "/writing" },
      { label: "Speaking", icon: Mic, href: "/speaking" },
      { label: "Planner", icon: CalendarDays, href: "/planner" },
      { label: "Analytics", icon: BarChart3, href: "/analytics" },
      { label: "Achievements", icon: Trophy, href: "/achievements" },
      { label: "AI Tools", icon: Sparkles, href: "/ai-tools" },
    ],
  },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Search or navigate..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {COMMANDS.map((group, i) => (
          <div key={group.group}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={group.group}>
              {group.items.map(({ label, icon: Icon, href }) => (
                <CommandItem
                  key={href}
                  onSelect={() => handleSelect(href)}
                  className="cursor-pointer"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
