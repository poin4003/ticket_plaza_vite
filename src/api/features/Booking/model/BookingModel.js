export class Booking {
  constructor(data) {
    this.id = data.id || null
    this.bookingCode = data.bookingCode || ''
    this.ticket = data.ticket ? new Ticket(data.ticket) : null
    this.user = data.user || {}
    this.quantity = data.quantity || 0
    this.totalAmount = data.totalAmount || 0
    this.status = data.status || false
  }
}