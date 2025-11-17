import { Hono } from "hono";
import type { Env } from './core-utils';
import { bad } from './core-utils';
import type { JellyfinProxyRequest } from "@shared/types";
export function userRoutes(app: Hono<{Bindings: Env;}>) {
  app.post('/api/jellyfin-proxy', async (c) => {
    try {
      const { path, serverUrl, apiKey, accessToken, method = 'GET', body } = await c.req.json<JellyfinProxyRequest & {accessToken?: string;}>();
      if (!serverUrl || !apiKey || !path) {
        return bad(c, 'Missing required fields: serverUrl, apiKey, path');
      }
      const targetUrl = new URL(path, serverUrl).toString();
      const token = accessToken || apiKey;
      const headers = new Headers({
        'X-Emby-Token': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      });
      const requestOptions: RequestInit = {
        method,
        headers
      };
      if (body && (method === 'POST' || method === 'PUT')) {
        requestOptions.body = JSON.stringify(body);
      }
      const response = await fetch(targetUrl, requestOptions);
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      return newResponse;
    } catch (error) {
      console.error('Jellyfin proxy error:', error);
      return c.json({ success: false, error: 'Proxy request failed' }, 500);
    }
  });
}