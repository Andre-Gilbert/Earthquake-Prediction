import { Alignment, Button, Card, Classes, H1, H5, Icon, Menu } from '@blueprintjs/core';
import { MenuItem2, Popover2 } from '@blueprintjs/popover2';
import { ItemPredicate, ItemRenderer, Select2 } from '@blueprintjs/select';
import { UseQueryResult } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import styles from './EarthquakesPrediction.module.scss';
import { EarthquakesPrediction, useEarthquakesPrediction } from './queries';

const Map = dynamic<{}>(() => import('@sections/EarthquakesPredictionSection/Map').then(module => module.Map), {
    ssr: false,
});

export const EarthquakesPredictionSection = () => {
    const earthquakesPredictionQuery = useEarthquakesPrediction();

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <Card className={styles.cardMap}>
                    <MapHeader />
                    <Map />
                </Card>
                <Earthquakes query={earthquakesPredictionQuery} />
            </div>
        </div>
    );
};

interface Region {
    name: string;
}

const REGIONS: Region[] = [{ name: 'All' }, { name: 'USA' }, { name: 'Europe' }];

const Header = () => {
    const [regions, setRegions] = useState([...REGIONS]);
    const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);

    const handleItemSelect = useCallback(
        (region: Region) => {
            setSelectedRegion(region);
            setRegions(regions);
        },
        [regions],
    );

    const renderRegion = useCallback<ItemRenderer<Region>>(
        (region, props) => {
            if (!props.modifiers.matchesPredicate) return null;
            return (
                <MenuItem2
                    active={props.modifiers.active}
                    text={region.name}
                    roleStructure="listoption"
                    onClick={props.handleClick}
                    selected={region === selectedRegion}
                />
            );
        },
        [selectedRegion],
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

    return (
        <div className={`${Classes.ELEVATION_0} ${styles.header}`}>
            <div className={styles.headerContainer}>
                <H1 className={styles.title}>Explore Earthquakes</H1>
                <p className={styles.subtitle}>Allows one to explore ...</p>
                <Select2
                    className={styles.select}
                    items={regions}
                    itemPredicate={filterRegion}
                    itemRenderer={renderRegion}
                    onItemSelect={handleItemSelect}
                    noResults={<MenuItem2 disabled text="No results." roleStructure="listoption" />}
                    popoverProps={{ placement: 'auto', matchTargetWidth: true }}
                    fill
                >
                    <Button
                        className={styles.btnSelect}
                        text={selectedRegion ? selectedRegion.name : '(No selection)'}
                        alignText={Alignment.LEFT}
                        rightIcon="caret-down"
                        fill
                    />
                </Select2>
            </div>
        </div>
    );
};

const MapHeader = () => {
    return (
        <div className={styles.mapHeader}>
            <div className={styles.mapTitle}>
                <Icon icon="map-marker" />
                <H5>Location</H5>
            </div>
        </div>
    );
};

type EarthquakesProps = {
    query: UseQueryResult<EarthquakesPrediction, Error>;
};

const Earthquakes = ({ query }: EarthquakesProps) => {
    const predictions = useMemo(() => query.data?.predictions.map(prediction => prediction.id), [query.data]);

    return (
        <div className={styles.earthquakesList}>
            <Card className={styles.earthquakesListCard}>
                <EarthquakesHeader />
                <ListItem></ListItem>
                <ListItem></ListItem>
                <ListItem></ListItem>
                <ListItem></ListItem>
                {predictions}
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

const EarthquakesHeader = () => {
    return (
        <div className={styles.earthquakesHeader}>
            <div className={styles.mapTitle}>
                <Icon icon="area-of-interest" />
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
