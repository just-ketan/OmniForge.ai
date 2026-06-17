import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { LayoutGrid, Layers, Sparkles, Clock, Settings, Plus } from "lucide-react";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/")}>
            <LayoutGrid className="size-4" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/brands")}>
            <Layers className="size-4" /> Brands
          </CommandItem>
          <CommandItem onSelect={() => go("/generator")}>
            <Sparkles className="size-4" /> Campaign Generator
          </CommandItem>
          <CommandItem onSelect={() => go("/history")}>
            <Clock className="size-4" /> History
          </CommandItem>
          <CommandItem onSelect={() => go("/settings")}>
            <Settings className="size-4" /> Settings
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go("/generator")}>
            <Plus className="size-4" /> New campaign
          </CommandItem>
          <CommandItem onSelect={() => go("/brands")}>
            <Plus className="size-4" /> Register brand
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}