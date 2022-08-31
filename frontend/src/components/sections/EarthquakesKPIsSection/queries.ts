import { usgsInstance } from '@config/axios';
import { useQuery } from '@tanstack/react-query';
import { getDate } from '@utils/date';

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
