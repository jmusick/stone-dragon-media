import { env as workerEnv } from "cloudflare:workers";
import type { TicketPriority } from "./tickets";

type TicketNotification = {
  kind: "created" | "reply";
  ticketId: string;
  companyName: string;
  subject: string;
  priority: TicketPriority;
};

// Email delivery is best-effort and must never change the result of a ticket write.
export function notifyTicket(locals: App.Locals, ticket: TicketNotification): void {
  try {
    const config = workerEnv as unknown as { EMAIL?: SendEmail; NOTIFY_TO?: string; NOTIFY_FROM?: string };
    if (!config.EMAIL || !config.NOTIFY_TO || !config.NOTIFY_FROM) return;
    const subject = (ticket.kind === "created"
      ? `New ticket from ${ticket.companyName}: ${ticket.subject}`
      : `Client reply: ${ticket.subject}`).replace(/[\r\n]/g, " ");
    const text = `Client: ${ticket.companyName}\nTicket: ${ticket.subject}\nPriority: ${ticket.priority}\nhttps://stonedragonmedia.com/admin/tickets/${ticket.ticketId}`;
    const delivery = Promise.resolve().then(() => config.EMAIL!.send({
      from: config.NOTIFY_FROM!, to: config.NOTIFY_TO!, subject, text,
    })).catch(() => {
      console.error(JSON.stringify({ event: "notify_failed", stage: "send", status: 500 }));
    });
    locals.cfContext.waitUntil(delivery);
  } catch {
    console.error(JSON.stringify({ event: "notify_failed", stage: "schedule", status: 500 }));
  }
}
