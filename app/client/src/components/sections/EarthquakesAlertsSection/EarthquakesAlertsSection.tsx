import { Button, Card, Checkbox, Classes, H5, Icon, Menu, MenuDivider } from '@blueprintjs/core';
import { DateRange, DateRangePicker } from '@blueprintjs/datetime';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { MAX_DATE, MIN_DATE } from '@common/date';
import { usgsInstance } from '@config/axios';
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import moment from 'moment';
import { FormEvent, useState } from 'react';
import { Earthquakes } from 'types/earthquakes';
import styles from './EarthquakesAlerts.module.scss';
import { getAlertLevelTooltip, getColor, getMagnitudeTypeTooltip } from './utils';

export const EarthquakesAlertsSection = () => {
    const [alertLevels, setAlertLevels] = useState(new Set(['green', 'yellow', 'orange', 'red']));
    const [greenAlert, setGreenAlert] = useState(true);
    const [yellowAlert, setYellowAlert] = useState(true);
    const [orangeAlert, setOrangeAlert] = useState(true);
    const [redAlert, setRedAlert] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange>([MIN_DATE, MAX_DATE]);
    const [queryParams, setQueryParams] = useState({
        starttime: moment(dateRange[0]).format('DD-MM-YYYY'),
        endtime: moment(dateRange[1]).format('DD-MM-YYYY'),
    });
    const earthquakesAlertQueries = useEarthquakesAlert(Array.from(alertLevels), queryParams);

    const handleGreenAlert = () => setGreenAlert(!greenAlert);
    const handleYellowAlert = () => setYellowAlert(!yellowAlert);
    const handleOrangeAlert = () => setOrangeAlert(!orangeAlert);
    const handleRedAlert = () => setRedAlert(!redAlert);
    const handleDateChange = (dateRange: DateRange) => setDateRange(dateRange);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newAlertLevels = new Set(alertLevels);
        greenAlert ? newAlertLevels.add('green') : newAlertLevels.delete('green');
        yellowAlert ? newAlertLevels.add('yellow') : newAlertLevels.delete('yellow');
        orangeAlert ? newAlertLevels.add('orange') : newAlertLevels.delete('orange');
        redAlert ? newAlertLevels.add('red') : newAlertLevels.delete('red');
        setAlertLevels(newAlertLevels);

        const [startDate, endDate] = dateRange;
        setQueryParams({
            starttime: moment(startDate).format('DD-MM-YYYY'),
            endtime: moment(endDate).format('DD-MM-YYYY'),
        });
    };

    return (
        <div className={styles.alerts}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Header
                        greenAlert={greenAlert}
                        handleGreenAlert={handleGreenAlert}
                        yellowAlert={yellowAlert}
                        handleYellowAlert={handleYellowAlert}
                        orangeAlert={orangeAlert}
                        handleOrangeAlert={handleOrangeAlert}
                        redAlert={redAlert}
                        handleRedAlert={handleRedAlert}
                        dateRange={dateRange}
                        handleSubmit={handleSubmit}
                        handleDateChange={handleDateChange}
                    />
                    <Alerts queries={earthquakesAlertQueries} />
                </Card>
            </div>
        </div>
    );
};

type FilterProps = {
    greenAlert: boolean;
    handleGreenAlert: () => void;
    yellowAlert: boolean;
    handleYellowAlert: () => void;
    orangeAlert: boolean;
    handleOrangeAlert: () => void;
    redAlert: boolean;
    handleRedAlert: () => void;
    dateRange: DateRange;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    handleDateChange: (dateRange: DateRange) => void;
};

const Header = (props: FilterProps) => {
    return (
        <div className={styles.header}>
            <div className={styles.alertsTitle}>
                <Icon icon="warning-sign" />
                <H5>Earthquake Alerts</H5>
            </div>
            <Popover2 content={<FilterMenu {...props} />} placement="bottom-end">
                <Button type="button" icon="filter" minimal />
            </Popover2>
        </div>
    );
};

const FilterMenu = ({
    greenAlert,
    handleGreenAlert,
    yellowAlert,
    handleYellowAlert,
    orangeAlert,
    handleOrangeAlert,
    redAlert,
    handleRedAlert,
    dateRange,
    handleSubmit,
    handleDateChange,
}: FilterProps) => {
    return (
        <Menu className={styles.menu}>
            <form onSubmit={handleSubmit}>
                <MenuDivider title="Alert Levels" />
                <Checkbox
                    checked={greenAlert}
                    className={styles.checkbox}
                    label="Green (No response needed)"
                    onChange={handleGreenAlert}
                />
                <Checkbox
                    checked={yellowAlert}
                    className={styles.checkbox}
                    label="Yellow (Local/Regional)"
                    onChange={handleYellowAlert}
                />
                <Checkbox
                    checked={orangeAlert}
                    className={styles.checkbox}
                    label="Orange (National)"
                    onChange={handleOrangeAlert}
                />
                <Checkbox
                    checked={redAlert}
                    className={styles.checkbox}
                    label="Red (International)"
                    onChange={handleRedAlert}
                />
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
                    <Button type="submit" text="Submit" intent="primary" fill />
                </div>
            </form>
        </Menu>
    );
};

type AlertsProps = {
    queries: UseQueryResult<Earthquakes, unknown>[];
};

const Alerts = ({ queries }: AlertsProps) => {
    return (
        <>
            <div className={styles.alertLabels}>
                <p className={Classes.TEXT_MUTED}>Date</p>
                <p className={Classes.TEXT_MUTED}>Place</p>
                <p className={Classes.TEXT_MUTED}>Magnitude</p>
                <p className={Classes.TEXT_MUTED}>Magnitude Type</p>
                <p className={Classes.TEXT_MUTED}>Depth</p>
            </div>
            {queries.some(query => query.isLoading) ? (
                <Loading />
            ) : (
                queries.map(query =>
                    query.data?.features.map(
                        earthquake =>
                            earthquake.properties.place && (
                                <Alert
                                    key={earthquake.id}
                                    time={earthquake.properties.time}
                                    place={earthquake.properties.place}
                                    magnitude={earthquake.properties.mag}
                                    magnitudeType={earthquake.properties.magType}
                                    depth={earthquake.geometry.coordinates[2]}
                                    alert={earthquake.properties.alert}
                                />
                            ),
                    ),
                )
            )}
        </>
    );
};

type AlertProps = {
    time: number;
    place: string;
    magnitude: number;
    magnitudeType: string;
    depth: number;
    alert: string;
};

const Alert = ({ time, place, magnitude, magnitudeType, depth, alert }: AlertProps) => {
    const date = new Date(time);

    return (
        <div className={styles.alert}>
            <Tooltip2 position="right" content={<div>{getAlertLevelTooltip(alert)}</div>}>
                <Icon icon="info-sign" style={{ color: getColor(alert) }} />
            </Tooltip2>
            <div className={styles.alertContent}>{date.toLocaleString()}</div>
            <div className={styles.alertContent}>{place}</div>
            <div className={styles.alertContent}>{magnitude}</div>
            <div className={styles.alertContent}>
                <Tooltip2
                    position="left"
                    content={<MagnitudeTooltipContent {...getMagnitudeTypeTooltip(magnitudeType)} />}
                >
                    {magnitudeType}
                </Tooltip2>
            </div>
            <div className={styles.alertContent}>{depth}</div>
        </div>
    );
};

type MagnitudeTooltipContentProps = {
    magnitudeRange: string;
    distanceRange: string;
};

const MagnitudeTooltipContent = ({ magnitudeRange, distanceRange }: MagnitudeTooltipContentProps) => {
    return (
        <>
            <div>Magnitude range: {magnitudeRange}</div>
            <div>Distance range: {distanceRange}</div>
        </>
    );
};

type QueryParams = { starttime: string; endtime: string };

const useEarthquakesAlert = (alertLevels: string[], queryParams: QueryParams) => {
    return useQueries({
        queries: alertLevels.map(alertLevel => {
            return {
                queryKey: [`alert-level-${alertLevel}-days`, alertLevel, queryParams],
                queryFn: () => fetchEarthquakesAlert(alertLevel, queryParams),
            };
        }),
    });
};

const fetchEarthquakesAlert = async (alertLevel: string, queryParams: QueryParams): Promise<Earthquakes> => {
    return await usgsInstance
        .get('query', {
            params: {
                format: 'geojson',
                eventtype: 'earthquake',
                alertlevel: alertLevel,
                ...queryParams,
            },
        })
        .then(response => response.data);
};

const Loading = () => {
    return (
        <>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
            <div className={styles.alertLoading}>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
                <div className={`${Classes.SKELETON} ${styles.loading}`}>Loading</div>
            </div>
        </>
    );
};
