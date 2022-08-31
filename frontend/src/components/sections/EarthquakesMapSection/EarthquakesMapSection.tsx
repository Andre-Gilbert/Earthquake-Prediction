import { Button, Card, H5, Icon, Menu } from '@blueprintjs/core';
import { MenuItem2, Popover2 } from '@blueprintjs/popover2';
import { MapProps } from '@sections/EarthquakesMapSection/Map';
import dynamic from 'next/dynamic';
import styles from './EarthquakesMap.module.scss';
import { useEarthquakes } from './queries';

const Map = dynamic<MapProps>(() => import('@sections/EarthquakesMapSection/Map').then(module => module.Map), {
    ssr: false,
});

export const EarthquakesMapSection = () => {
    const earthquakesQuery = useEarthquakes('map', 30, 1000);

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
                <Button type="button" icon="filter" minimal />
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
