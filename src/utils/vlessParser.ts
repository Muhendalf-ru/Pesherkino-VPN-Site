import type { ParsedVlessUrl } from '../types/ServerConfigTypes';

export function parseVlessUrl(vlessUrl: string): ParsedVlessUrl | null {
  try {
    // Убираем префикс vless://
    const urlWithoutPrefix = vlessUrl.replace('vless://', '');
    
    // Разделяем на части: uuid@host:port?params#name
    const [credentialsAndHost, queryAndName] = urlWithoutPrefix.split('?');
    const [credentials, hostPort] = credentialsAndHost.split('@');
    
    if (!credentials || !hostPort) {
      throw new Error('Неверный формат VLESS ссылки');
    }
    
    const [host, portStr] = hostPort.split(':');
    const port = parseInt(portStr, 10);
    
    if (!host || isNaN(port)) {
      throw new Error('Неверный хост или порт');
    }
    
    // Парсим параметры запроса
    const [queryParams, name] = queryAndName ? queryAndName.split('#') : ['', ''];
    const params = new URLSearchParams(queryParams);
    
    return {
      uuid: credentials,
      host,
      port,
      type: params.get('type') || 'tcp',
      security: params.get('security') || 'reality',
      pbk: params.get('pbk') || '',
      fp: params.get('fp') || 'chrome',
      sni: params.get('sni') || '',
      sid: params.get('sid') || '',
      spx: params.get('spx') || '/',
      flow: params.get('flow') || 'xtls-rprx-vision',
      name: decodeURIComponent(name || ''),
    };
  } catch (error) {
    console.error('Ошибка парсинга VLESS ссылки:', error);
    return null;
  }
}

export function validateVlessUrl(vlessUrl: string): boolean {
  const parsed = parseVlessUrl(vlessUrl);
  return parsed !== null;
}

export function generateVlessUrl(config: {
  uuid: string;
  host: string;
  port: number;
  type?: string;
  security?: string;
  pbk: string;
  fp?: string;
  sni: string;
  sid: string;
  spx?: string;
  flow?: string;
  name?: string;
}): string {
  const {
    uuid,
    host,
    port,
    type = 'tcp',
    security = 'reality',
    pbk,
    fp = 'chrome',
    sni,
    sid,
    spx = '/',
    flow = 'xtls-rprx-vision',
    name = '',
  } = config;

  const params = new URLSearchParams({
    type,
    security,
    pbk,
    fp,
    sni,
    sid,
    spx,
    flow,
  });

  const url = `vless://${uuid}@${host}:${port}?${params.toString()}`;
  return name ? `${url}#${encodeURIComponent(name)}` : url;
} 