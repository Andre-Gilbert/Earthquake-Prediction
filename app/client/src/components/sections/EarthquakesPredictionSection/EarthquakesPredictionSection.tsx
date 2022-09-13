import { Alignment, Button, Card, Classes, H1, H5, Icon, Menu, MenuDivider } from '@blueprintjs/core';
import { DateRange, DateRangePicker } from '@blueprintjs/datetime';
import { Classes as Popover2Classes, MenuItem2, Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { ItemPredicate, ItemRenderer, Select2 } from '@blueprintjs/select';
import { MAX_DATE, MIN_DATE } from '@common/date';
import { getMagnitudeTypeTooltip, MagnitudeTooltipContent } from '@common/Tooltip';
import { apiInstance } from '@config/axios';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { FormEvent, useCallback, useMemo, useState } from 'react';
import styles from './EarthquakesPrediction.module.scss';

const Map = dynamic(() => import('@sections/EarthquakesPredictionSection/Map'), {
    ssr: false,
});

export const EarthquakesPredictionSection = () => {
    const [dateRange, setDateRange] = useState<DateRange>([MIN_DATE, MAX_DATE]);
    const [queryParams, setQueryParams] = useState<DateRange>([dateRange[0], dateRange[1]]);
    const earthquakesPredictionQuery = useEarthquakesPrediction(queryParams);

    const handleDateChange = (dateRange: DateRange) => setDateRange(dateRange);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setQueryParams([dateRange[0], dateRange[1]]);
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <Card className={styles.cardMap}>
                    <MapHeader />
                    <Map />
                </Card>
                <Earthquakes
                    query={earthquakesPredictionQuery}
                    handleSubmit={handleSubmit}
                    dateRange={dateRange}
                    handleDateChange={handleDateChange}
                />
            </div>
        </div>
    );
};

interface Region {
    name: string;
}

const REGIONS: Region[] = [{ name: 'All Regions' }, { name: 'USA' }, { name: 'Europe' }];

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

type FilterProps = {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    dateRange: DateRange;
    handleDateChange: (dateRange: DateRange) => void;
};

type EarthquakesProps = {
    query: UseQueryResult<EarthquakesPrediction, Error>;
};

const Earthquakes = ({ query, ...props }: EarthquakesProps & FilterProps) => {
    const predictions = useMemo(
        () =>
            query.data?.predictions.map(earthquake => (
                <ListItem
                    key={earthquake.id}
                    time={earthquake.time}
                    place={earthquake.place}
                    prediction={earthquake.prediction}
                    mag={earthquake.mag}
                    magType={earthquake.magType}
                    depth={earthquake.depth}
                />
            )),
        [query.data],
    );

    return (
        <div className={styles.earthquakesList}>
            <Card className={styles.earthquakesListCard}>
                <EarthquakesHeader {...props} />
                {query.isLoading ? (
                    <Loading />
                ) : query.isError ? (
                    <div className={styles.error}>
                        <H1 className={styles.errorTitle}>{query.error.message}</H1>
                    </div>
                ) : (
                    predictions
                )}
            </Card>
        </div>
    );
};

type EarthquakePrediction = {
    time: string;
    place: string;
    prediction: number;
    mag: number;
    magType: string;
    depth: number;
};

const ListItem = ({ time, place, prediction, mag, magType, depth }: EarthquakePrediction) => {
    return (
        <div className={styles.listItem}>
            <Icon icon="info-sign" intent="primary" />
            <div className={styles.listItemContent}>{time}</div>
            <div className={styles.listItemContent}>{place}</div>
            <div className={styles.listItemContent}>{prediction}</div>
            <div className={styles.listItemContent}>{mag}</div>
            <div className={styles.listItemContent}>
                <Tooltip2 position="left" content={<MagnitudeTooltipContent {...getMagnitudeTypeTooltip(magType)} />}>
                    {magType}
                </Tooltip2>
            </div>
            <div className={styles.listItemContent}>{depth}</div>
        </div>
    );
};

const EarthquakesHeader = (props: FilterProps) => {
    return (
        <div className={styles.earthquakesHeader}>
            <div className={styles.earthquakesHeaderFilters}>
                <div className={styles.mapTitle}>
                    <Icon icon="area-of-interest" />
                    <H5>Earthquakes Predictions</H5>
                </div>
                <Popover2 content={<FilterMenu {...props} />} placement="bottom-end">
                    <Button type="button" icon="filter" minimal />
                </Popover2>
            </div>
            <div className={styles.earthquakesListLabels}>
                <p className={Classes.TEXT_MUTED}>Date</p>
                <p className={Classes.TEXT_MUTED}>Place</p>
                <p className={Classes.TEXT_MUTED}>Prediction</p>
                <p className={Classes.TEXT_MUTED}>Magnitude</p>
                <p className={Classes.TEXT_MUTED}>Magnitude Type</p>
                <p className={Classes.TEXT_MUTED}>Depth</p>
            </div>
        </div>
    );
};

const FilterMenu = ({ handleSubmit, dateRange, handleDateChange }: FilterProps) => {
    return (
        <Menu>
            <form onSubmit={handleSubmit}>
                <MenuDivider title="Earthquakes Date Range" />
                <DateRangePicker
                    defaultValue={dateRange}
                    minDate={MIN_DATE}
                    maxDate={MAX_DATE}
                    singleMonthOnly
                    shortcuts={false}
                    onChange={handleDateChange}
                />
                <div className={styles.btnForm}>
                    <Button
                        className={Popover2Classes.POPOVER2_DISMISS}
                        type="submit"
                        text="Submit"
                        intent="primary"
                        fill
                    />
                </div>
            </form>
        </Menu>
    );
};

interface EarthquakesPrediction {
    predictions: Earthquake[];
}

interface Earthquake {
    time: string;
    latitude: number;
    longitude: number;
    depth: number;
    mag: number;
    magType: string;
    id: string;
    place: string;
    prediction: number;
}

const useEarthquakesPrediction = (dateRange: DateRange) => {
    return useQuery<EarthquakesPrediction, Error>(['earthquakes-prediction', dateRange], () =>
        fetchEarthquakesPrediction(dateRange),
    );
};

const fetchEarthquakesPrediction = async (dateRange: DateRange): Promise<EarthquakesPrediction> => {
    return await apiInstance
        .post('api/v1/earthquakes/predict-magnitudes', {
            starttime: moment(dateRange[0]).format('DD-MM-YYYY'),
            endtime: moment(dateRange[1]).format('DD-MM-YYYY'),
        })
        .then(response => response.data);
};

const Loading = () => {
    return (
        <>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.listItemLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
        </>
    );
};
