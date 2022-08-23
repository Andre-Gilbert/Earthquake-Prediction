import { Card, Classes } from '@blueprintjs/core';
import { useEarthquakeKPI } from 'queries/earthquakes';
import styles from './EarthquakeKPIs.module.scss';

export const EarthquakesKPIsSection = () => {
    const countLastWeek = useEarthquakeKPI(7);
    const countLastMonth = useEarthquakeKPI(30);

    return (
        <div className={styles.KPIs}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div className={countLastWeek.isLoading ? Classes.SKELETON : ''}>
                        {countLastWeek.isError ? countLastWeek.error.message : countLastWeek?.data?.count}
                    </div>
                </Card>
                <Card className={styles.card}>
                    <div className={countLastMonth.isLoading ? Classes.SKELETON : ''}>
                        {countLastMonth.isError ? countLastMonth.error.message : countLastMonth?.data?.count}
                    </div>
                </Card>
            </div>
        </div>
    );
};
