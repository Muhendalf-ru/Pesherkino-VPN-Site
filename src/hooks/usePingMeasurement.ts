import { useState, useEffect } from 'react';

interface Location {
  name: string;
  ping: string;
  flag: string;
  hosts: string[];
}

export const usePingMeasurement = (initialLocations: Location[]) => {
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  const measurePing = async (hosts: string[]) => {
    const pings: number[] = [];

    for (const host of hosts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // Таймаут 2 секунды

        const startTime = performance.now();
        await fetch(host, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal,
          headers: {
            Accept: '*/*',
            Connection: 'keep-alive',
          },
        });
        const endTime = performance.now();
        clearTimeout(timeoutId);

        // Вычитаем время на DNS-запрос и обработку ответа
        const ping = Math.round(endTime - startTime - 50); // Примерное время на обработку
        if (ping > 0) pings.push(ping);
      } catch {
        continue;
      }
    }

    if (pings.length === 0) return '∞';

    // Возвращаем минимальное значение пинга
    return Math.min(...pings);
  };

  useEffect(() => {
    const updatePings = async () => {
      const updatedLocations = await Promise.all(
        locations.map(async (location) => {
          const ping = await measurePing(location.hosts);
          return { ...location, ping: typeof ping === 'number' ? `${ping}ms` : ping };
        }),
      );
      setLocations(updatedLocations);
    };

    updatePings();
    const interval = setInterval(updatePings, 60000); // Обновляем каждые 60 секунд

    return () => clearInterval(interval);
  }, []);

  return locations;
}; 