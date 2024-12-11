export interface User {
  id: string;
  username: string;
  password: string;
  maxConnections: number;
  expiryDate: string;
  active: boolean;
  createdAt: string;
}

export interface XtreamCredentials {
  host: string;
  username: string;
  password: string;
  port: number;
}