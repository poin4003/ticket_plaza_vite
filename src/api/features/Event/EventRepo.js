import client from "../../client";
import { ApiPath } from "../../ApiPath";

export class EventRepo {
  static async getEvents(
    page = 0,
    limit = 10,
    name = "",
    startDate = "",
    endDate = ""
  ) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (name) params.append("name", name);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const url = `${ApiPath.GET_EVENTS}?${params.toString()}`;
    return await client.get(url);
  }

  static async getEventDetail(eventId) {
    const url = `${ApiPath.GET_EVENT_DETAILS}${eventId}`;
    return await client.get(url);
  }

  static async createEvent(eventName, media, location, startDate, endDate) {
    const payload = {
      eventName,
      media,
      location,
      startDate,
      endDate,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    return await client.post(ApiPath.ADD_EVENT, payload, { headers });
  }

  static async updateEvent(
    eventId,
    eventName,
    media,
    location,
    startDate,
    endDate
  ) {
    const payload = {
      eventName,
      media,
      location,
      startDate,
      endDate,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const url = `${ApiPath.ADD_EVENT}/${eventId}`;
    return await client.put(url, payload, { headers });
  }

  static async deleteEvent(eventId) {
    const url = `${ApiPath.DELETE_EVENT}${eventId}`;
    return await client.delete(url);
  }
}

export const eventRepo = new EventRepo();
