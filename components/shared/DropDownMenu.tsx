"use client";

import { EllipsisIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { DropDownMenuOptions } from "@/types";
import { cn } from "@/lib/utils";

/**
 * The content renders in a portal on document.body and Radix flips or shifts
 * it to stay inside the viewport, so a scrolling parent (the content modal)
 * can't clip it. z-[100000] keeps it above AppModalProvider's z-99999.
 */
const DropDownMenu = ({ options }: { options: DropDownMenuOptions }) => {
  return (
    // Non-modal: no scroll lock or pointer-events on body, which would fight
    // with the app modal's own scroll lock.
    <DropdownMenuPrimitive.Root modal={false}>
      <DropdownMenuPrimitive.Trigger
        aria-label="More options"
        // Cards that open on click must not open when the menu does.
        onClick={(e) => e.stopPropagation()}
        className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary data-[state=open]:bg-surface-muted"
      >
        <EllipsisIcon className="size-5" />
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={4}
          collisionPadding={8}
          // The app modal closes on Escape from a window listener; stop the
          // event here so Escape only closes the menu.
          onEscapeKeyDown={(e) => e.stopPropagation()}
          // React events bubble through portals to the card underneath.
          onClick={(e) => e.stopPropagation()}
          className="z-[100000] min-w-44 max-w-[calc(100vw-16px)] max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {options.map((item) => (
            <DropdownMenuPrimitive.Item
              key={item.label}
              onSelect={item.fn}
              className={cn(
                "flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors data-highlighted:bg-surface-muted",
                item.destructive && "text-destructive",
              )}
            >
              {item.icon && <item.icon className="size-4 shrink-0" />}
              <span className="truncate">{item.label}</span>
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default DropDownMenu;
