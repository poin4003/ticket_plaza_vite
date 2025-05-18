import config from "../configs/config";

export const ApiPath = {
  // Auth
  LOGIN_ADMIN: getApiPath("/login"),
	LOGOUT_ADMIN: getApiPath("/logout"),

	// Admin
	ADD_EVENT: getAdminApiPath("/event"),
	UPDATE_EVENT: getAdminApiPath("/event/"),
	DELETE_EVENT: getAdminApiPath("/event/"),
  ADD_TICKET: getAdminApiPath("/event/"),
  UPDATE_TICKET: getAdminApiPath("/event/"),
  DELETE_TICKET: getAdminApiPath("/event/"),

	// Public
	GET_EVENTS: getPublicApiPath("/event"),
	GET_EVENT_DETAILS: getPublicApiPath("/event/"),
	BOOK_TICKET: getPublicApiPath("/book_ticket/"),
	GET_BOOKED_TICKET: getPublicApiPath("/book_ticket"),
};

function getAdminApiPath(path) {	
  return `${config.app.main_api}/api/admin${path}`
}

function getPublicApiPath(path) {	
  return `${config.app.main_api}/api/public${path}`;
}

function getApiPath(path) {
  return `${config.app.main_api}${path}`
}