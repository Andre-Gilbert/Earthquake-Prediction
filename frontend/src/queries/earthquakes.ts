import { useQuery } from '@tanstack/react-query';
import { EARTHQUAKE_URL } from './config';

export const useEarthquakes = (cacheName: string, days: number, limit: number) => {
    const query = useQuery([`earthquake-${cacheName}`, days, limit], async () => {
        const startDate = getDate(Date.now(), days);
        const endDate = getDate(Date.now(), 0);
        const response = await fetch(
            `${EARTHQUAKE_URL}/query?format=geojson&starttime=${startDate}&endtime=${endDate}&limit=${limit}`,
        );
        if (!response.ok) throw new Error();
        return response.json();
    });

    return query;
};

const ALERTS = ['green', 'yellow', 'orange', 'red'];

export const useEarthquakeAlerts = (days: number) => {
    const query = useQuery([`earthquake-alerts-data`, days], async () => {
        const startDate = getDate(Date.now(), days);
        const endDate = getDate(Date.now(), 0);
        const response = await fetch(
            `${EARTHQUAKE_URL}/query?format=geojson&starttime=${startDate}&endtime=${endDate}`,
        );
        if (!response.ok) throw new Error();
        return response.json();
    });

    return query;
};

interface IEarthquakeKPI {
    count: number;
    maxAllowed: number;
}

export const useEarthquakeKPI = (days: number) => {
    const query = useQuery<IEarthquakeKPI, Error>([`earthquakes-last-${days}-days`, days], async () => {
        const startDate = getDate(Date.now(), days);
        const endDate = getDate(Date.now(), 0);
        const response = await fetch(
            `${EARTHQUAKE_URL}/count?format=geojson&starttime=${startDate}&endtime=${endDate}`,
        );
        if (!response.ok) throw new Error();
        return response.json();
    });

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
