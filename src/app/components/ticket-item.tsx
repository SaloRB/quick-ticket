import Link from "next/link";

import type { Ticket } from "@/generated/prisma";

import { getPriorityClass } from "@/utils/ui";

type TicketItemProps = {
  ticket: Ticket;
};

function TicketItem({ ticket }: TicketItemProps) {
  const isClosed = ticket.status === "Closed";

  return (
    <div
      className={`flex justify-between items-center bg-white rounded-lg shadow border border-gray-200 p-6 ${isClosed && "opacity-50"}`}
      key={ticket.id}
    >
      {/* Left Side */}
      <div>
        <h2 className="text-xl font-semibold text-blue-600">{ticket.subject}</h2>
      </div>

      {/* Right Side */}
      <div className="text-right space-y-2">
        <div className="text-sm text-gray-500">
          Priority:
          <span className={getPriorityClass(ticket.priority)}>
            {ticket.priority}
          </span>
        </div>
        <Link
          href={`/tickets/${ticket.id}`}
          className={
            `inline-block mt-2 text-sm px-3 py-1 rounded transition text-center ${
              isClosed
                ? "bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none"
                : "bg-blue-600 hover:bg-blue-700 text-white"}`
          }
        >
          View Ticket
        </Link>
      </div>
    </div>
  );
}
export default TicketItem;
