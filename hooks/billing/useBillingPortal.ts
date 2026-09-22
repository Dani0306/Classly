import { useTransition } from "react";
import { createPortalSession } from "@/actions/billing";
import { useToast } from "@/providers/ToastProvider";

/** Opens Paddle's customer portal (cancel, payment method, invoices). */
export const useBillingPortal = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const openPortal = () => {
    // Open the tab during the click; browsers block window.open after an
    // await. The URL is filled in once the session exists.
    const tab = window.open("", "_blank");

    startTransition(async () => {
      try {
        const url = await createPortalSession();

        if (tab) tab.location.href = url;
        else window.location.assign(url);
      } catch (error) {
        tab?.close();

        toast({
          type: "error",
          title: "Couldn't open billing",
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        });
      }
    });
  };

  return { openPortal, isPending };
};
