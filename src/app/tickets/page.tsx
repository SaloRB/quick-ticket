import { redirect } from "next/navigation";

import { getTickets } from "@/actions/ticket.actions";
import { getCurrentUser } from "@/lib/current-user";

import TicketItem from "../components/ticket-item";

async function TicketsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const tickets = await getTickets();

  return (
    <div className="bg-blue-50 p-8 flex-1">
      <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">Support Tickets</h1>
      {!tickets.length
        ? <p className="text-center text-gray-600">No Tickets Yet</p>
        : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {tickets.map(ticket => (
                <TicketItem key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
    </div>
  );
}
export default TicketsPage;
