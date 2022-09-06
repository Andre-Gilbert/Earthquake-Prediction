import { Alignment, Button, Card, Checkbox, Classes, H5, Icon, Menu, MenuDivider, Switch } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';
import { Earthquakes } from 'types/earthquakes';
import styles from './EarthquakesAlerts.module.scss';
import { useEarthquakesAlert } from './queries';
import { filterDate, getColor, getLastDate, getMagnitudeTypeTooltip } from './utils';

export const EarthquakesAlertsSection = () => {
    const [isChecked7Days, setIsChecked7Days] = useState(false);
    const [alertLevels, setAlertLevels] = useState(['green', 'yellow', 'orange', 'red']);
    const earthquakesAlertQueries = useEarthquakesAlert(alertLevels);

    const handle7Days = () => setIsChecked7Days(!isChecked7Days);

    return (
        <div className={styles.alerts}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Header isChecked7Days={isChecked7Days} handle7Days={handle7Days} />
                    <Alerts queries={earthquakesAlertQueries} isChecked7Days={isChecked7Days} />
                </Card>
            </div>
        </div>
    );
};

type FilterProps = {
    isChecked7Days: boolean;
    handle7Days: () => void;
};

const Header = ({ isChecked7Days, handle7Days }: FilterProps) => {
    return (
        <div className={styles.header}>
            <div className={styles.alertsTitle}>
                <Icon icon="warning-sign" />
                <H5>Earthquake Alerts</H5>
            </div>
            <div className={styles.headerFlex}>
                <Switch
                    className={styles.switch}
                    alignIndicator={Alignment.RIGHT}
                    innerLabelChecked="7 Days"
                    innerLabel="30 Days"
                    checked={isChecked7Days}
                    onChange={handle7Days}
                />
                <Button className={styles.btn} icon="list" minimal />
                <Button className={styles.btn} icon="grid-view" minimal />
                <Popover2 content={<FilterMenu />} placement="bottom-end">
                    <Button type="button" icon="filter" minimal />
                </Popover2>
            </div>
        </div>
    );
};

const FilterMenu = () => {
    return (
        <Menu>
            <MenuDivider title="Alert Levels" />
            <Checkbox className={styles.checkbox} label="Green" />
            <Checkbox className={styles.checkbox} label="Yellow" />
            <Checkbox className={styles.checkbox} label="Orange" />
            <Checkbox className={styles.checkbox} label="Red" />
        </Menu>
    );
};

type AlertsProps = {
    queries: UseQueryResult<Earthquakes, unknown>[];
    isChecked7Days: boolean;
};

const Alerts = ({ queries, isChecked7Days }: AlertsProps) => {
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
                            filterDate(earthquake.properties.time, getLastDate(isChecked7Days)) &&
                            earthquake.properties.place && (
                                <Alert
                                    key={earthquake.id}
                                    time={earthquake.properties.time}
                                    place={earthquake.properties.place}
                                    magnitude={earthquake.properties.mag}
                                    magnitudeType={earthquake.properties.magType}
                                    magnitudeTypeTooltip={getMagnitudeTypeTooltip(earthquake.properties.magType)}
                                    depth={earthquake.geometry.coordinates[2]}
                                    color={getColor(earthquake.properties.alert)}
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
    magnitudeTypeTooltip: { magnitudeRange: string; distanceRange: string };
    depth: number;
    color: string;
};

const Alert = ({ time, place, magnitude, magnitudeType, magnitudeTypeTooltip, depth, color }: AlertProps) => {
    const date = new Date(time);

    return (
        <div className={styles.alert}>
            <Icon icon="info-sign" style={{ color: color }} />
            <div className={styles.alertContent}>{date.toLocaleString()}</div>
            <div className={styles.alertContent}>{place}</div>
            <div className={styles.alertContent}>{magnitude}</div>
            <div className={styles.alertContent}>
                <Tooltip2 position="left" content={<TooltipContent {...magnitudeTypeTooltip} />}>
                    {magnitudeType}
                </Tooltip2>
            </div>
            <div className={styles.alertContent}>{depth}</div>
        </div>
    );
};

type TooltipContentProps = {
    magnitudeRange: string;
    distanceRange: string;
};

const TooltipContent = ({ magnitudeRange, distanceRange }: TooltipContentProps) => {
    return (
        <>
            <p className={styles.tooltip}>Magnitude range: {magnitudeRange}</p>
            <p className={styles.tooltip}>Distance range: {distanceRange}</p>
        </>
    );
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
        </>
    );
};
