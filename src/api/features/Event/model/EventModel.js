export class Event {
  constructor(data) {
    this.id = data.id || null
    this.eventName = data.eventName || ''
    this.media = data.media || []
    this.location = data.location || ''
    this.startDate = data.startDate || ''
    this.endDate = data.endDate || ''
    this.tickets = data.tickets || []
  }
}