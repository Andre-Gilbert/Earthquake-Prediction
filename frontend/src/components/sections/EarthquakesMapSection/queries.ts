import { usgsInstance } from '@config/axios';
import { useQuery } from '@tanstack/react-query';
import { getDate } from '@utils/date';
import { Earthquakes } from 'types/earthquakes';

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
