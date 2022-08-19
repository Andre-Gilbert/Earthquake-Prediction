import { Card } from '@blueprintjs/core';
import styles from './EarthquakesKPIs.module.scss';

export const EarthquakesKPIsSection = () => {
    return (
        <div className={styles.KPIs}>
            <Card></Card>
            <Card></Card>
        </div>
    );
};
