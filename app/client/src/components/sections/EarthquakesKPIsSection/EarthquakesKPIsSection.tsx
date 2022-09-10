import { Card, Classes, H1, H5 } from '@blueprintjs/core';
import { usgsInstance } from '@config/axios';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { z } from 'zod';
import styles from './EarthquakesKPIs.module.scss';

export const EarthquakesKPIsSection = () => {
    const earthquakesLastWeek = useEarthquakesKPI(7);
    const earthquakesLastMonth = useEarthquakesKPI(30);

    return (
        <div className={styles.KPIs}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div>
                        <H1 className={earthquakesLastWeek.isLoading ? Classes.SKELETON : ''}>
                            {earthquakesLastWeek.isError
                                ? earthquakesLastWeek.error.message
                                : earthquakesLastWeek.isLoading
                                ? 'Loading'
                                : earthquakesLastWeek.data?.count}
                        </H1>
                        <H5 className={styles.cardSubtitle}>Earthquakes Last 7 Days</H5>
                    </div>
                </Card>
                <Card className={styles.card}>
                    <div>
                        <H1 className={earthquakesLastMonth.isLoading ? Classes.SKELETON : ''}>
                            {earthquakesLastMonth.isError
                                ? earthquakesLastMonth.error.message
                                : earthquakesLastMonth.isLoading
                                ? 'Loading'
                                : earthquakesLastMonth.data?.count}
                        </H1>
                        <H5 className={styles.cardSubtitle}>Earthquakes Last 30 Days</H5>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const earthquakesKPI = z.object({ count: z.number().gte(0).lte(20000), maxAllowed: z.number() });

type EarthquakesKPI = z.infer<typeof earthquakesKPI>;

const useEarthquakesKPI = (days: number) => {
    return useQuery<EarthquakesKPI, Error>([`earthquakes-last-${days}-days`, days], () => fetchEarthquakesCount(days));
};

const fetchEarthquakesCount = async (days: number): Promise<EarthquakesKPI> => {
    return await usgsInstance
        .get('count', {
            params: {
                format: 'geojson',
                starttime: moment().add(-days, 'days').format('DD-MM-YYYY'),
                endtime: moment().format('DD-MM-YYYY'),
                eventtype: 'earthquake',
            },
        })
        .then(response => earthquakesKPI.parse(response.data));
};
