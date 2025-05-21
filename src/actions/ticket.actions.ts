"use server";

import { revalidatePath } from "next/cache";

import type { Priority } from "@/generated/prisma";

import { prisma } from "@/db/prisma";
import { logEvent } from "@/utils/sentry";

export async function createTicket(
  _: ResponseResult,
  formData: FormData,
): Promise<ResponseResult> {
  try {
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as Priority;

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

export async function getTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    logEvent({
      message: "Fetched ticket list",
      category: "ticket",
      level: "info",
      data: {
        count: tickets.length,
      },
    });

    return tickets;
  }
  catch (error) {
    logEvent({
      message: "Error fetching tickets",
      category: "ticket",
      level: "error",
      error,
    });

    return [];
  }
}

export async function getTicketById(id: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    if (!ticket) {
      logEvent({
        message: "Ticket not found",
        category: "ticket",
        level: "warning",
        data: { ticketId: id },
      });
    }

    return ticket;
  }
  catch (error) {
    logEvent({
      message: "Error fetching ticket details",
      category: "ticket",
      level: "error",
      data: { ticketId: id },
      error,
    });

    return null;
  }
}
