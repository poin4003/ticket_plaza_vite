import client from "../../client"
import { ApiPath } from "../../ApiPath"

export class AuthRepo {
  async login(username, password) {
    const credentials = btoa(`${username}:${password}`);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    };

    const params = new URLSearchParams({ username, password });
    return await client.post(`${ApiPath.LOGIN_ADMIN}`, params, { headers });
  }

  async logout() {
    const storedCredentials = localStorage.getItem('adminCredentials');
    let headers = {};
    if (storedCredentials) {
      const { username, password } = JSON.parse(storedCredentials);
      const credentials = btoa(`${username}:${password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }

    return await client.post(ApiPath.LOGOUT_ADMIN, null, { headers });
  }
}

export const authRepo = new AuthRepo()
