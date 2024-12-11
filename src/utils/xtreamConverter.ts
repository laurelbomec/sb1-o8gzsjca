import type { Channel, Playlist } from '../types/playlist';
import type { XtreamCredentials } from '../types/user';

export function generateXtreamCredentials(playlist: Playlist): XtreamCredentials {
  const username = generateRandomString(10);
  const password = generateRandomString(10);
  
  return {
    host: window.location.hostname,
    username,
    password,
    port: 8080
  };
}

export function convertToXtreamFormat(channels: Channel[], credentials: XtreamCredentials) {
  const baseUrl = `http://${credentials.host}:${credentials.port}/live/${credentials.username}/${credentials.password}`;
  
  return channels.map((channel, index) => ({
    ...channel,
    url: `${baseUrl}/${index + 1}`,
    streamId: index + 1
  }));
}

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}