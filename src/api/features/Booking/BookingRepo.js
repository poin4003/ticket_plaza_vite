import client from "../../client"
import { ApiPath } from "../../ApiPath"

export class BookingRepo {
  static async getBookingLookup(code) {
    const params = new URLSearchParams()
    params.append('code', code)
    const url = `${ApiPath.GET_BOOKED_TICKET}?${params.toString()}`
    return client.get(url)
  }

  static async bookTicket(ticketId, fullName, phoneNumber, email, quantity) {
    const payload = {
      fullName,
      phoneNumber,
      email,
      quantity
    }

    const headers = {
      "Content-Type": "application/json",
    };


    const url = `${ApiPath.BOOK_TICKET}${ticketId}`;

    return await client.post(url, payload, { headers });
  }
}

export const bookingRepo = new BookingRepo()