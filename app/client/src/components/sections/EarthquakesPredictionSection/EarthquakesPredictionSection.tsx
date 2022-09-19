import {
    Alignment,
    Button,
    Card,
    Classes,
    Drawer,
    H1,
    H5,
    Icon,
    Menu,
    MenuDivider,
    Position,
    Spinner,
    SpinnerSize,
} from '@blueprintjs/core';
import { DateRange, DateRangePicker } from '@blueprintjs/datetime';
import { Classes as Popover2Classes, MenuItem2, Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { ItemPredicate, ItemRenderer, Select2 } from '@blueprintjs/select';
import { MAX_DATE, MIN_DATE } from '@common/date';
import { getMagnitudeTypeTooltip, MagnitudeTooltipContent } from '@common/Tooltip';
import { apiInstance } from '@config/axios';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import moment from 'moment';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { z } from 'zod';
import styles from './EarthquakesPrediction.module.scss';
import { addScrollbarStyle } from './utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartOptions = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
    },
    stacked: false,
    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            grid: {
                drawOnChartArea: false,
            },
        },
    },
    maintainAspectRatio: false,
};

export const EarthquakesPredictionSection = () => {
    const [dateRange, setDateRange] = useState<DateRange>([MIN_DATE, MAX_DATE]);
    const [queryParams, setQueryParams] = useState<DateRange>([dateRange[0], dateRange[1]]);
    const earthquakesPredictionQuery = useEarthquakesPrediction(queryParams);

    const handleDateChange = (dateRange: DateRange) => setDateRange(dateRange);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setQueryParams([dateRange[0], dateRange[1]]);
    };

    // Prevents layout shifts
    useEffect(() => addScrollbarStyle(), []);

    const labels = useMemo(
        () =>
            earthquakesPredictionQuery.data?.predictions.map(earthquake =>
                moment(earthquake.time).format('DD/MM/YYYY, hh:mm:ss'),
            ),
        [earthquakesPredictionQuery.data],
    );

    const predictions = useMemo(
        () => earthquakesPredictionQuery.data?.predictions.map(earthquake => earthquake.prediction),
        [earthquakesPredictionQuery.data],
    );

    const magnitudes = useMemo(
        () => earthquakesPredictionQuery.data?.predictions.map(earthquake => earthquake.mag),
        [earthquakesPredictionQuery.data],
    );

    const data = {
        labels,
        datasets: [
            {
                label: 'Prediction',
                data: predictions,
                yAxisID: 'y',
                borderColor: 'rgb(255, 99, 132, 0.75)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Magnitude',
                data: magnitudes,
                yAxisID: 'y1',
                borderColor: 'rgb(53, 162, 235, 0.75)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <Card className={styles.earthquakesChart}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartFlex}>
                            <div className={styles.chartTitle}>
                                <Icon icon="timeline-line-chart" />
                                <H5>Magnitude vs. Prediction</H5>
                            </div>
                            <Popover2
                                content={
                                    <FilterMenu
                                        handleSubmit={handleSubmit}
                                        dateRange={dateRange}
                                        handleDateChange={handleDateChange}
                                    />
                                }
                                placement="bottom-end"
                            >
                                <Button type="button" icon="filter" minimal />
                            </Popover2>
                        </div>
                    </div>
                    <div className={styles.chart}>
                        {earthquakesPredictionQuery.isLoading ? (
                            <div className={styles.chartLoading}>
                                <Spinner size={SpinnerSize.LARGE} />
                            </div>
                        ) : earthquakesPredictionQuery.isError ? (
                            <div className={styles.chartError}>
                                <H1 className={styles.chartErrorTitle}>{earthquakesPredictionQuery.error?.message}</H1>
                            </div>
                        ) : (
                            <Line options={chartOptions} data={data} height={720} />
                        )}
                    </div>
                </Card>
                <Earthquakes
                    query={earthquakesPredictionQuery}
                    handleSubmit={handleSubmit}
                    dateRange={dateRange}
                    handleDateChange={handleDateChange}
                />
            </div>
        </>
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

type EarthquakesProps = {
    query: UseQueryResult<EarthquakesPrediction, Error>;
};

type FilterProps = {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    dateRange: DateRange;
    handleDateChange: (dateRange: DateRange) => void;
};

const Earthquakes = ({ query, ...props }: EarthquakesProps & FilterProps) => {
    const predictions = useMemo(
        () => query.data?.predictions.map(earthquake => <ListItem key={earthquake.id} earthquake={earthquake} />),
        [query.data],
    );

    return (
        <div className={`${Classes.ELEVATION_0} ${styles.earthquakesList}`}>
            <div className={styles.earthquakesHeaderFilters}>
                <div className={styles.mapTitle}>
                    <Icon icon="area-of-interest" />
                    <H5>Earthquakes Predictions</H5>
                </div>
                <Popover2 content={<FilterMenu {...props} />} placement="bottom-end">
                    <Button type="button" icon="filter" minimal />
                </Popover2>
            </div>
            <div className={styles.earthquakesListCard}>
                <div className={styles.earthquakesListLabels}>
                    <p className={Classes.TEXT_MUTED}>Date</p>
                    <p className={Classes.TEXT_MUTED}>Place</p>
                    <p className={Classes.TEXT_MUTED}>Prediction</p>
                    <p className={Classes.TEXT_MUTED}>Magnitude</p>
                    <p className={Classes.TEXT_MUTED}>Magnitude Type</p>
                    <p className={Classes.TEXT_MUTED}>Depth</p>
                </div>
                {query.isLoading ? <Loading /> : query.isError ? <Error message={query.error.message} /> : predictions}
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

type EarthquakePrediction = {
    earthquake: {
        time: string;
        latitude: number;
        longitude: number;
        depth: number;
        mag: number;
        magType: string;
        id: string;
        place: string;
        prediction: number;
    };
};

const ListItem = ({ earthquake }: EarthquakePrediction) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            <div className={isOpen ? `${styles.listItem} ${styles.active}` : styles.listItem} onClick={handleOpen}>
                <Icon icon="info-sign" intent="primary" />
                <div className={styles.listItemContent}>{moment(earthquake.time).format('DD/MM/YYYY, hh:mm:ss')}</div>
                <div className={styles.listItemContent}>{earthquake.place}</div>
                <div className={styles.listItemContent}>{earthquake.prediction}</div>
                <div className={styles.listItemContent}>{earthquake.mag}</div>
                <div className={styles.listItemContent}>
                    <Tooltip2
                        position="left"
                        content={<MagnitudeTooltipContent {...getMagnitudeTypeTooltip(earthquake.magType)} />}
                    >
                        {earthquake.magType}
                    </Tooltip2>
                </div>
                <div className={styles.listItemContent}>{earthquake.depth}</div>
            </div>
            <Drawer
                isOpen={isOpen}
                onClose={handleClose}
                position={Position.RIGHT}
                title={`${earthquake.id} - ${earthquake.place}`}
            >
                <DrawerContent earthquake={earthquake} />
            </Drawer>
        </>
    );
};

const DrawerContent = ({ earthquake }: EarthquakePrediction) => {
    return (
        <div className={`${Classes.DRAWER_BODY} ${styles.drawerBodyBackgroundColor}`}>
            <div className={Classes.DIALOG_BODY}>
                <div className={styles.drawerCardKPIFlex}>
                    <Card className={styles.drawerCardKPI}>
                        <H1>{earthquake.mag}</H1>
                        <H5 className={styles.cardSubtitle}>Magnitude for the event</H5>
                    </Card>
                    <Card className={styles.drawerCardKPI}>
                        <H1>{earthquake.prediction}</H1>
                        <H5 className={styles.cardSubtitle}>Predicted Magnitude for the event</H5>
                    </Card>
                    <Card className={styles.drawerCardKPI}>
                        <H1>{earthquake.depth}</H1>
                        <H5 className={styles.cardSubtitle}>Depth of the event in kilometers</H5>
                    </Card>
                </div>
                <Card className={styles.cardMap}>
                    <MapHeader />
                </Card>
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

const earthquakesPredictionValidator = z.object({
    predictions: z
        .object({
            time: z.string(),
            latitude: z.number().gte(-90).lte(90),
            longitude: z.number().gte(-360).lte(360),
            depth: z.number(),
            mag: z.number(),
            magType: z.string(),
            id: z.string(),
            place: z.string(),
            prediction: z.number(),
        })
        .array(),
});

type EarthquakesPrediction = z.infer<typeof earthquakesPredictionValidator>;

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
        .then(response => earthquakesPredictionValidator.parse(response.data));
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

const Error = ({ message }: { message: string }) => {
    return (
        <div className={styles.error}>
            <H1 className={styles.errorTitle}>{message}</H1>
        </div>
    );
};
