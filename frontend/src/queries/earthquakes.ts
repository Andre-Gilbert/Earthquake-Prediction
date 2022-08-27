import { useQuery } from '@tanstack/react-query';
import { usgsInstance } from './config';

export interface Earthquakes {
    type: 'FeatureCollection';
    metadata: {
        generated: number;
        url: string;
        title: string;
        api: string;
        count: number;
        status: number;
    };
    bbox: number[];
    features: EarthquakeFeature[];
}

interface EarthquakeFeature {
    type: 'Feature';
    properties: {
        mag: number;
        place: string;
        time: number;
        updated: number;
        tz: number;
        url: string;
        detail: string;
        felt: number;
        cdi: number;
        mmi: number;
        alert: string;
        status: string;
        tsunami: number;
        sig: number;
        net: string;
        code: string;
        ids: string;
        sources: string;
        types: string;
        nst: number;
        dmin: number;
        rms: number;
        gap: number;
        magType: string;
        type: string;
    };
    geometry: {
        type: 'Point';
        coordinates: number[];
    };
    id: string;
}

export const useEarthquakes = (cacheName: string, days: number, limit: number) => {
    return useQuery<Earthquakes, Error>([`earthquake-${cacheName}`, days, limit], () => fetchEarthquakes(days, limit));
};

const fetchEarthquakes = async (days: number, limit: number): Promise<Earthquakes> => {
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
};

interface EarthquakesKPI {
    count: number;
    maxAllowed: number;
}

export const useEarthquakesKPI = (days: number) => {
    return useQuery<EarthquakesKPI, Error>([`earthquake-last-${days}-days`, days], () => fetchEarthquakesCount(days));
};

const fetchEarthquakesCount = async (days: number): Promise<EarthquakesKPI> => {
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
};

const getDate = (currentDate: number, days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - days);
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return year + '-' + month + '-' + day;
};
