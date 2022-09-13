import { Button, Card, Checkbox, Classes, H1, H5, Icon, Menu, MenuDivider } from '@blueprintjs/core';
import { DateRange, DateRangePicker } from '@blueprintjs/datetime';
import { Classes as Popover2Classes, Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { MAX_DATE, MIN_DATE } from '@common/date';
import { getMagnitudeTypeTooltip, MagnitudeTooltipContent } from '@common/Tooltip';
import { usgsInstance } from '@config/axios';
import { useQueries } from '@tanstack/react-query';
import moment from 'moment';
import { FormEvent, useState } from 'react';
import { Earthquakes } from 'types/earthquakes';
import styles from './EarthquakesAlerts.module.scss';
import { getAlertLevelTooltip, getColor } from './utils';

export const EarthquakesAlertsSection = () => {
    const [alertLevels, setAlertLevels] = useState(new Set(['green', 'yellow', 'orange', 'red']));
    const [greenAlert, setGreenAlert] = useState(true);
    const [yellowAlert, setYellowAlert] = useState(true);
    const [orangeAlert, setOrangeAlert] = useState(true);
    const [redAlert, setRedAlert] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange>([MIN_DATE, MAX_DATE]);
    const [queryParams, setQueryParams] = useState<DateRange>([dateRange[0], dateRange[1]]);
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
        setQueryParams([dateRange[0], dateRange[1]]);
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
                    {earthquakesAlertQueries.some(query => query.isLoading) ? (
                        <Loading />
                    ) : earthquakesAlertQueries.every(query => !query.data?.features.length) ? (
                        <NoData />
                    ) : (
                        earthquakesAlertQueries.map(query =>
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
            <div className={styles.headerFilters}>
                <div className={styles.alertsTitle}>
                    <Icon icon="warning-sign" />
                    <H5>Earthquake Alerts</H5>
                </div>
                <Popover2 content={<FilterMenu {...props} />} placement="bottom-end">
                    <Button type="button" icon="filter" minimal />
                </Popover2>
            </div>
            <div className={styles.alertLabels}>
                <p className={Classes.TEXT_MUTED}>Date</p>
                <p className={Classes.TEXT_MUTED}>Place</p>
                <p className={Classes.TEXT_MUTED}>Magnitude</p>
                <p className={Classes.TEXT_MUTED}>Magnitude Type</p>
                <p className={Classes.TEXT_MUTED}>Depth</p>
            </div>
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

const useEarthquakesAlert = (alertLevels: string[], dateRange: DateRange) => {
    return useQueries({
        queries: alertLevels.map(alertLevel => {
            return {
                queryKey: [`alert-level-${alertLevel}-days`, alertLevel, dateRange],
                queryFn: () => fetchEarthquakesAlert(alertLevel, dateRange),
            };
        }),
    });
};

const fetchEarthquakesAlert = async (alertLevel: string, dateRange: DateRange): Promise<Earthquakes> => {
    return await usgsInstance
        .get('query', {
            params: {
                format: 'geojson',
                eventtype: 'earthquake',
                alertlevel: alertLevel,
                starttime: moment(dateRange[0]).format('DD-MM-YYYY'),
                endtime: moment(dateRange[1]).format('DD-MM-YYYY'),
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

const NoData = () => {
    return (
        <div className={styles.noData}>
            <H1 className={styles.noDataTitle}>No Data</H1>
        </div>
    );
};
