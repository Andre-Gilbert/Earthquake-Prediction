import { Card } from '@blueprintjs/core';
import styles from './EarthquakesKPIs.module.scss';

export const EarthquakesKPIsSection = () => {
    return (
        <div className={styles.KPIs}>
            <div className={styles.container}>
                <Card>Card 1</Card>
                <Card>Card 2</Card>
            </div>
        </div>
    );
};
