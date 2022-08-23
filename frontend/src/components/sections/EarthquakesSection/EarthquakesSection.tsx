import { Card, Classes, H1 } from '@blueprintjs/core';
import styles from './Earthquakes.module.scss';

export const EarthquakesSection = () => {
    return (
        <div className={styles.earthquakes}>
            <div className={`${Classes.ELEVATION_0} ${styles.header}`}>
                <div className={styles.headerContainer}>
                    <H1 className={styles.title}>Explore Earthquakes</H1>
                    <p className={styles.subtitle}>Allows one to explore ...</p>
                </div>
            </div>
            <div className={styles.container}>
                <Earthquakes />
            </div>
        </div>
    );
};

const Earthquakes = () => {
    return (
        <div className={styles.earthquakesList}>
            <Card className={styles.card}>
                <ListItem></ListItem>
                <ListItem></ListItem>
                <ListItem></ListItem>
                <ListItem></ListItem>
                <ListItem></ListItem>
            </Card>
        </div>
    );
};

const ListItem = () => {
    return (
        <div className={styles.listItem}>
            <div className={Classes.SKELETON}>Item</div>
        </div>
    );
};
