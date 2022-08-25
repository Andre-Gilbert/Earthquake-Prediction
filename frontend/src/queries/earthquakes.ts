import { useQueries, useQuery } from '@tanstack/react-query';
import { usgsInstance } from './config';

export const useEarthquakes = (cacheName: string, days: number, limit: number = 20000) => {
    const query = useQuery([`earthquake-${cacheName}`, days, limit], async (): Promise<any> => {
        return await usgsInstance
            .get('query', {
                params: {
                    format: 'geojson',
                    starttime: getDate(Date.now(), days),
                    endtime: getDate(Date.now(), 0),
                    eventtype: 'earthquake',
                    limit: limit,
                },
            })
            .then(response => response.data);
    });

    return query;
};

export const useEarthquakeAlerts = (alertLevels: string[], days: number) => {
    const queries = useQueries({
        queries: alertLevels.map(alertLevel => {
            return {
                queryKey: [`alert-${alertLevel}`, alertLevel, days],
                queryFn: async (): Promise<any> => {
                    return await usgsInstance.get('query', {
                        params: {
                            format: 'geojson',
                            starttime: getDate(Date.now(), days),
                            endtime: getDate(Date.now(), 0),
                            alertlevel: alertLevel,
                        },
                    });
                },
            };
        }),
    });

    return queries;
};

interface EarthquakeKPI {
    count: number;
    maxAllowed: number;
}

export const useEarthquakeKPI = (days: number) => {
    const query = useQuery<EarthquakeKPI, Error>(
        [`earthquake-last-${days}-days`, days],
        async (): Promise<EarthquakeKPI> => {
            return await usgsInstance
                .get('count', {
                    params: {
                        format: 'geojson',
                        starttime: getDate(Date.now(), days),
                        endtime: getDate(Date.now(), 0),
                        eventtype: 'earthquake',
                    },
                })
                .then(response => response.data);
        },
    );

    return query;
};

const getDate = (currentDate: number, days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - days);
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return year + '-' + month + '-' + day;
};
