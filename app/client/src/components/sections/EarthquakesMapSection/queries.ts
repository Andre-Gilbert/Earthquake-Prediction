import { usgsInstance } from '@config/axios';
import { useQuery } from '@tanstack/react-query';
import { getDate } from '@utils/date';
import { Earthquakes } from 'types/earthquakes';

export interface Location {
    minlatitude: number;
    maxlatitude: number;
    minlongitude: number;
    maxlongitude: number;
}

export const useEarthquakes = (location: Location) => {
    return useQuery<Earthquakes, Error>(['earthquakes--map', location], () => fetchEarthquakes(location));
};

const fetchEarthquakes = async (location: Location): Promise<Earthquakes> => {
    return await usgsInstance
        .get('query', {
            params: {
                format: 'geojson',
                starttime: getDate(Date.now(), 30),
                endtime: getDate(Date.now(), 0),
                eventtype: 'earthquake',
                limit: 1000,
                ...location,
            },
        })
        .then(response => response.data);
};
