import { Button, Card, H5, Icon, Menu } from '@blueprintjs/core';
import { MenuItem2, Popover2 } from '@blueprintjs/popover2';
import { MapProps } from '@sections/EarthquakeMapSection/Map';
import dynamic from 'next/dynamic';
import { useEarthquakes } from 'queries/earthquakes';
import styles from './EarthquakeMap.module.scss';

const Map = dynamic<MapProps>(() => import('@sections/EarthquakeMapSection/Map').then(module => module.Map), {
    ssr: false,
});

export const EarthquakeMapSection = () => {
    const earthquakesQuery = useEarthquakes('map', 30, 300);

    return (
        <div className={styles.location}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Header />
                    <Map query={earthquakesQuery} />
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
            <Popover2 content={<FilterMenu />} placement="bottom-end">
                <Button icon="filter" minimal />
            </Popover2>
        </div>
    );
};

const FilterMenu = () => {
    return (
        <Menu>
            <MenuItem2 text="Filters" />
        </Menu>
    );
};
