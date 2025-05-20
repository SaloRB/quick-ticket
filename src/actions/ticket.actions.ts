"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/db/prisma";
import { logEvent } from "@/utils/sentry";

export async function createTicket(
  _: CreateTicketResponse,
  formData: FormData,
): Promise<CreateTicketResponse> {
  try {
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;

    if (!subject || !description || !priority) {
      logEvent({
        message: "Validation Error: missing ticket fields",
        category: "ticket",
        level: "warning",
        data: {
          subject,
          description,
          priority,
        },
      });

      return {
        success: false,
        message: "All fields are required",
      };
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        priority,
      },
    });

    logEvent({
      message: `Ticket ${ticket.id} created successfully`,
      category: "ticket",
      level: "info",
      data: {
        ticketId: ticket.id,
      },
    });

    revalidatePath("/tickets");

    return {
      success: true,
      message: "Ticket created successfully",
    };
  }
  catch (error) {
    logEvent({
      message: "An error ocurred while creating the ticket",
      category: "ticket",
      level: "error",
      data: {
        formData: Object.fromEntries(formData.entries()),
      },
      error,
    });
    return {
      success: false,
      message: "An error occurred while creating the ticket",
    };
  }
}
