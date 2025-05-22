"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { closeTicket } from "@/actions/ticket.actions";

type ClosedTicketButtonProps = {
  ticketId: number;
};

function CloseTicketButton({ ticketId }: ClosedTicketButtonProps) {
  const initialState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useActionState(closeTicket, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    }
    else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <button
        className="bg-red-500 text-white px-3 py-3 w-full rounded hover:bg-red-600 transition cursor-pointer"
        type="submit"
      >
        Close Ticket
      </button>
    </form>
  );
}
export default CloseTicketButton;
