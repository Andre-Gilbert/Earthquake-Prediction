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
import { Classes as Popover2Classes, Popover2 } from '@blueprintjs/popover2';
import { MAX_DATE, MIN_DATE } from '@common/date';
import { showToast } from '@common/Toast';
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
import { FormEvent, useEffect, useMemo, useState } from 'react';
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
            position: 'top' as const,
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
        if (dateRange[0] === null || dateRange[1] === null) {
            showToast('date range', 'Range must be greater than 1');
            return;
        }
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
            <div className={`${Classes.ELEVATION_0} ${styles.header}`}>
                <div className={styles.headerContainer}>
                    <H1 className={styles.title}>Explore Earthquakes</H1>
                    <p className={styles.subtitle}>
                        Earthquakes are a space to explore magnitude predictions and analyze nearby earthquakes by
                        selecting an object.
                    </p>
                    <Popover2
                        content={
                            <FilterMenu
                                dateRange={dateRange}
                                handleDateChange={handleDateChange}
                                handleSubmit={handleSubmit}
                            />
                        }
                        placement="bottom"
                        fill
                    >
                        <Button
                            text={`${moment(dateRange[0]).format('DD/MM/YYYY')} - ${moment(dateRange[1]).format(
                                'DD/MM/YYYY',
                            )}`}
                            type="button"
                            alignText={Alignment.LEFT}
                            rightIcon="caret-down"
                            fill
                        />
                    </Popover2>
                </div>
            </div>
            <div className={styles.container}>
                <Card className={styles.earthquakesChart}>
                    <div className={styles.chartHeader}>
                        <div className={styles.cardTitle}>
                            <Icon icon="timeline-line-chart" />
                            <H5>Magnitude vs. Prediction</H5>
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
                <Earthquakes query={earthquakesPredictionQuery} />
            </div>
        </>
    );
};

type EarthquakesProps = {
    query: UseQueryResult<EarthquakesPrediction, Error>;
};

const Earthquakes = ({ query }: EarthquakesProps) => {
    const listItems = useMemo(
        () =>
            query.data?.predictions.map(earthquake => (
                <ListItem key={earthquake.id} earthquake={earthquake} queryData={query.data} />
            )),
        [query.data],
    );

    return (
        <div className={`${Classes.ELEVATION_0} ${styles.earthquakesList}`}>
            <div className={styles.listHeader}>
                <div className={styles.cardTitle}>
                    <Icon icon="area-of-interest" />
                    <H5>Earthquakes Predictions</H5>
                </div>
            </div>
            <div className={styles.earthquakesListCard}>
                <div className={styles.earthquakesListLabels}>
                    <p className={Classes.TEXT_MUTED}>Date</p>
                    <p className={Classes.TEXT_MUTED}>Place</p>
                    <p className={Classes.TEXT_MUTED}>Prediction</p>
                    <p className={Classes.TEXT_MUTED}>Magnitude</p>
                </div>
                {query.isLoading ? <Loading /> : query.isError ? <Error message={query.error.message} /> : listItems}
            </div>
        </div>
    );
};

type FilterProps = {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    dateRange: DateRange;
    handleDateChange: (dateRange: DateRange) => void;
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

export interface Prediction {
    time: string;
    latitude: number;
    longitude: number;
    mag: number;
    id: string;
    place: string;
    location: string;
    prediction: number;
}

type EarthquakePrediction = {
    earthquake: Prediction;
    queryData: {
        predictions: Prediction[];
    };
};

const ListItem = ({ earthquake, queryData }: EarthquakePrediction) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const filteredQueryData = useMemo(
        () => queryData?.predictions.filter(entry => entry.location == earthquake.location),
        [earthquake.location, queryData],
    );

    return (
        <>
            <div className={isOpen ? `${styles.listItem} ${styles.active}` : styles.listItem} onClick={handleOpen}>
                <Icon icon="info-sign" intent="primary" />
                <div className={styles.listItemContent}>{moment(earthquake.time).format('DD/MM/YYYY, hh:mm:ss')}</div>
                <div className={styles.listItemContent}>{earthquake.place}</div>
                <div className={styles.listItemContent}>{earthquake.prediction}</div>
                <div className={styles.listItemContent}>{earthquake.mag}</div>
            </div>
            <Drawer
                isOpen={isOpen}
                onClose={handleClose}
                position={Position.RIGHT}
                size="75%"
                title={`${earthquake.id} - ${earthquake.place}`}
            >
                <DrawerContent earthquake={earthquake} queryData={filteredQueryData} />
            </Drawer>
        </>
    );
};

const DrawerContent = ({ earthquake, queryData }: { earthquake: Prediction; queryData: Prediction[] }) => {
    const labels = useMemo(
        () => queryData.map(earthquake => moment(earthquake.time).format('DD/MM/YYYY, hh:mm:ss')),
        [queryData],
    );

    const predictions = useMemo(() => queryData.map(earthquake => earthquake.prediction), [queryData]);

    const magnitudes = useMemo(() => queryData.map(earthquake => earthquake.mag), [queryData]);

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

    const listItems = useMemo(
        () => queryData.map(earthquake => <DrawerListItem key={earthquake.id} earthquake={earthquake} />),
        [queryData],
    );

    return (
        <div className={`${Classes.DRAWER_BODY} ${styles.drawerContent}`}>
            <div className={styles.drawerContainer}>
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
                    </div>
                    <Card className={styles.drawerCardChart}>
                        <div className={styles.chartHeader}>
                            <div className={styles.cardTitle}>
                                <Icon icon="timeline-line-chart" />
                                <H5>Magnitude of Earthquakes in {earthquake.location}</H5>
                            </div>
                        </div>
                        <div className={styles.drawerChart}>
                            <Line options={chartOptions} data={data} height={520} />
                        </div>
                    </Card>
                    <Card className={styles.drawerPredictions}>
                        <div className={styles.drawerPredictionsTitle}>
                            <Icon icon="area-of-interest" />
                            <H5>Earthquakes in {earthquake.location}</H5>
                        </div>
                        <div className={styles.earthquakesListCard}>
                            <div className={styles.earthquakesListLabels}>
                                <p className={Classes.TEXT_MUTED}>Date</p>
                                <p className={Classes.TEXT_MUTED}>Place</p>
                                <p className={Classes.TEXT_MUTED}>Prediction</p>
                                <p className={Classes.TEXT_MUTED}>Magnitude</p>
                            </div>
                            {listItems}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const DrawerListItem = ({ earthquake }: { earthquake: Prediction }) => {
    return (
        <div className={styles.drawerListItem}>
            <Icon icon="info-sign" intent="primary" />
            <div className={styles.listItemContent}>{moment(earthquake.time).format('DD/MM/YYYY, hh:mm:ss')}</div>
            <div className={styles.listItemContent}>{earthquake.place}</div>
            <div className={styles.listItemContent}>{earthquake.prediction}</div>
            <div className={styles.listItemContent}>{earthquake.mag}</div>
        </div>
    );
};

const earthquakesPredictionValidator = z.object({
    predictions: z
        .object({
            time: z.string(),
            latitude: z.number().gte(-90).lte(90),
            longitude: z.number().gte(-360).lte(360),
            mag: z.number(),
            id: z.string(),
            place: z.string(),
            location: z.string(),
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
            </div>
            <div className={styles.listItemLoading}>
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
            </div>
            <div className={styles.listItemLoading}>
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
            </div>
            <div className={styles.listItemLoading}>
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
            </div>
            <div className={styles.listItemLoading}>
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
            </div>
            <div className={styles.listItemLoading}>
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
