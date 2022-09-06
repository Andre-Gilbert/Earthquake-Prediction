import { usgsInstance } from '@config/axios';
import { useQueries } from '@tanstack/react-query';
import { getDate } from '@utils/date';
import { Earthquakes } from 'types/earthquakes';

export const useEarthquakesAlert = (alertLevels: string[]) => {
    return useQueries({
        queries: alertLevels.map(alertLevel => {
            return {
                queryKey: [`alert-level-${alertLevel}-days`, alertLevel],
                queryFn: () => fetchEarthquakesAlert(alertLevel),
            };
        }),
    });
};

const fetchEarthquakesAlert = async (alertLevel: string): Promise<Earthquakes> => {
    return await usgsInstance
        .get('query', {
            params: {
                format: 'geojson',
                starttime: getDate(Date.now(), 30),
                endtime: getDate(Date.now(), 0),
                eventtype: 'earthquake',
                alertlevel: alertLevel,
            },
        })
        .then(response => response.data);
};
