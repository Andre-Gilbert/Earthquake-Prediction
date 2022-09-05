import { usgsInstance } from '@config/axios';
import { useQueries } from '@tanstack/react-query';
import { getDate } from '@utils/date';
import { Earthquakes } from 'types/earthquakes';

export const useEarthquakesAlert = (days: number, alertLevels: string[]) => {
    return useQueries({
        queries: alertLevels.map(alertLevel => {
            return {
                queryKey: [`alert-level-${alertLevel}`, days, alertLevel],
                queryFn: () => fetchEarthquakesAlert(days, alertLevel),
            };
        }),
    });
};

const fetchEarthquakesAlert = async (days: number, alertLevel: string): Promise<Earthquakes> => {
    return await usgsInstance
        .get('query', {
            params: {
                format: 'geojson',
                starttime: getDate(Date.now(), days),
                endtime: getDate(Date.now(), 0),
                eventtype: 'earthquake',
                alertlevel: alertLevel,
            },
        })
        .then(response => response.data);
};
