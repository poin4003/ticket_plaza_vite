import client from "../../client";
import { ApiPath } from "../../ApiPath";

export class TicketRepo {
  static async createTicket(
    eventId,
    ticketType, price, quantity, description
  ) {
    const payload = {
      ticketType,
      price,
      quantity,
      description
    };

    const headers = {
      "Content-Type": "application/json",
    };

    console.log(payload);

    const url = `${ApiPath.ADD_TICKET}${eventId}/ticket`
    return await client.post(url, payload, { headers });
  }

  static async updateTicket(
    eventId, ticketId,
    ticketType, price, quantity, description
  ) {
    const payload = {
      ticketType,
      price,
      quantity,
      description
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const url = `${ApiPath.UPDATE_TICKET}${eventId}/ticket/${ticketId}`
    return await client.put(url, payload, { headers });    
  }

  static async deleteTicket(
    eventId, ticketId
  ) { 
    const url = `${ApiPath.DELETE_TICKET}${eventId}/ticket/${ticketId}`
    return await client.delete(url);       
  }
}