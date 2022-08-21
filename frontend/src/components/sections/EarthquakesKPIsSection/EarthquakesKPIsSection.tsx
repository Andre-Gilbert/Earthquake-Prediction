import { Card, Classes } from '@blueprintjs/core';
import styles from './EarthquakesKPIs.module.scss';

export const EarthquakesKPIsSection = () => {
    return (
        <div className={styles.KPIs}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div className={Classes.SKELETON}>Card</div>
                </Card>
                <Card className={styles.card}>
                    <div className={Classes.SKELETON}>Card</div>
                </Card>
                <Card className={styles.card}>
                    <div className={Classes.SKELETON}>Card</div>
                </Card>
            </div>
        </div>
    );
};
