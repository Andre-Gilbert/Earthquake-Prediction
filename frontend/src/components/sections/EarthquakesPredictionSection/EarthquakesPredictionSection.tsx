import { Card, Classes, H1, H5, Icon, Menu } from '@blueprintjs/core';
import { MenuItem2 } from '@blueprintjs/popover2';
import { ItemPredicate, ItemRenderer, Suggest2 } from '@blueprintjs/select';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from './EarthquakesPrediction.module.scss';

const Map = dynamic<{}>(() => import('@sections/EarthquakesPredictionSection/Map').then(module => module.Map), {
    ssr: false,
});

export const EarthquakesPredictionSection = () => {
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <Card className={styles.cardMap}>
                    <MapHeader />
                    <Map />
                </Card>
                <Earthquakes />
            </div>
        </div>
    );
};

interface Region {
    name: string;
}

const REGIONS: Region[] = [{ name: 'USA' }, { name: 'Europe' }];

const Header = () => {
    const [region, setRegion] = useState('');
    const renderInputValue = (region: Region) => region.name;
    const handleValueChange = (region: Region) => setRegion(region.name);

    const renderRegion: ItemRenderer<Region> = (region, props) => (
        <MenuItem2
            active={props.modifiers.active}
            text={region.name}
            roleStructure="listoption"
            onClick={props.handleClick}
        />
    );

    const filterRegion: ItemPredicate<Region> = (query, region, _index, exactMatch) => {
        const normalizedTitle = region.name.toLowerCase();
        const normalizedQuery = query.toLowerCase();

        if (exactMatch) {
            return normalizedTitle === normalizedQuery;
        } else {
            return `${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
        }
    };

    console.log(region);

    return (
        <div className={`${Classes.ELEVATION_0} ${styles.header}`}>
            <div className={styles.headerContainer}>
                <H1 className={styles.title}>Explore Earthquakes</H1>
                <p className={styles.subtitle}>Allows one to explore ...</p>
                <Suggest2
                    items={REGIONS}
                    inputValueRenderer={renderInputValue}
                    itemPredicate={filterRegion}
                    itemRenderer={renderRegion}
                    onItemSelect={handleValueChange}
                    noResults={<MenuItem2 disabled text="No results." roleStructure="listoption" />}
                    popoverProps={{ minimal: true }}
                />
            </div>
        </div>
    );
};

const MapHeader = () => {
    return (
        <div className={styles.header}>
            <div className={styles.mapTitle}>
                <Icon icon="map-marker" />
                <H5>Location</H5>
            </div>
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

const Earthquakes = () => {
    return (
        <div className={styles.earthquakesList}>
            <Card className={styles.earthquakesListCard}>
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
