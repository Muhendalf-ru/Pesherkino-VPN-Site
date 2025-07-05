export interface IServerConfig {
  _id: string;
  serverId?: string; // ID сервера, к которому привязана конфигурация (опционально, так как API может не возвращать)
  label: string;
  host: string;
  pbk: string;
  sid: string;
  sni: string;
  port: number;
  location: string;
  countryCode: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServerConfigRequest {
  serverId?: string;
  label: string;
  host: string;
  pbk: string;
  sid: string;
  sni: string;
  port: number;
  location: string;
  countryCode: string;
  isActive?: boolean;
}

export interface UpdateServerConfigRequest {
  label?: string;
  host?: string;
  pbk?: string;
  sid?: string;
  sni?: string;
  port?: number;
  location?: string;
  countryCode?: string;
  isActive?: boolean;
}

export interface ParsedVlessUrl {
  uuid: string;
  host: string;
  port: number;
  type: string;
  security: string;
  pbk: string;
  fp: string;
  sni: string;
  sid: string;
  spx: string;
  flow: string;
  name: string;
} 