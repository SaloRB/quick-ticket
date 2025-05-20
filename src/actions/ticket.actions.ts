"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/db/prisma";

export async function createTicket(
  _: CreateTicketResponse,
  formData: FormData,
): Promise<CreateTicketResponse> {
  try {
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;

    if (!subject || !description || !priority) {
      Sentry.captureMessage("Validation error: Missing ticket fields", "warning");
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

    Sentry.addBreadcrumb({
      category: "ticket",
      message: `Ticket created: ${ticket.id}`,
      level: "info",
    });

    Sentry.captureMessage(`Ticket ${ticket.id} created successfully`, "info");

    revalidatePath("/tickets");

    return {
      success: true,
      message: "Ticket created successfully",
    };
  }
  catch (error) {
    Sentry.captureException(error as Error, {
      extra: {
        formData: Object.fromEntries(formData.entries()),
      },
    });
    return {
      success: false,
      message: "An error occurred while creating the ticket",
    };
  }
}
