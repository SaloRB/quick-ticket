import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";

import NewTicketForm from "./ticket-form";

async function NewTicketPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-blue-50 flex items-center justify-center px-4 flex-1">
      <NewTicketForm />
    </div>
  );
}
export default NewTicketPage;
