import { Button, Card, H5, Icon } from '@blueprintjs/core';
import dynamic from 'next/dynamic';
import styles from './EarthquakesMap.module.scss';

const Map = dynamic<{}>(() => import('@sections/EarthquakesMapSection/Map').then(module => module.Map), {
    ssr: false,
});

export const EarthquakesMapSection = () => {
    return (
        <div className={styles.location}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Header />
                    <Map />
                </Card>
            </div>
        </div>
    );
};

const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.mapTitle}>
                <Icon icon="map-marker" />
                <H5>Location</H5>
            </div>
            <Button icon="filter" minimal />
        </div>
    );
};
