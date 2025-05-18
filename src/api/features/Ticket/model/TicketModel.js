export class Ticket {
  constructor(data) {
    this.id = data.id || null
    this.price = data.price || 0
    this.ticketType = data.ticketType || ''
    this.quantity = data.quantity || 0
    this.description = data.description || ''
  }
}