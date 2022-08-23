import { Card, Classes, H1, H5 } from '@blueprintjs/core';
import { useEarthquakeKPI } from 'queries/earthquakes';
import styles from './EarthquakeKPIs.module.scss';

export const EarthquakeKPIsSection = () => {
    const earthquakesLastWeek = useEarthquakeKPI(7);
    const earthquakesLastMonth = useEarthquakeKPI(30);

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
