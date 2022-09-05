import { Button, Card, Checkbox, Classes, H5, Icon, Intent, Menu, MenuDivider } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';
import { Earthquakes } from 'types/earthquakes';
import styles from './EarthquakesAlerts.module.scss';
import { useEarthquakesAlert } from './queries';
import { getIntent, getMagnitudeTypeTooltip } from './utils';

export const EarthquakesAlertsSection = () => {
    const [alertLevels, setAlertLevels] = useState(['green', 'yellow', 'orange', 'red']);
    const earthquakesAlertQueries = useEarthquakesAlert(30, alertLevels);

    return (
        <div className={styles.alerts}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Header />
                    <Alerts queries={earthquakesAlertQueries} />
                </Card>
            </div>
        </div>
    );
};

const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.alertsTitle}>
                <Icon icon="warning-sign" />
                <H5>Earthquake Alerts</H5>
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
            <MenuDivider title="Alert Levels" />
            <Checkbox>Green</Checkbox>
            <Checkbox>Yellow</Checkbox>
            <Checkbox>Orange</Checkbox>
            <Checkbox>Red</Checkbox>
            <MenuDivider />
            <Checkbox>Last 7 Days</Checkbox>
            <Checkbox>Last 30 Days</Checkbox>
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
                                    time={earthquake.properties.time}
                                    place={earthquake.properties.place}
                                    magnitude={earthquake.properties.mag}
                                    magnitudeType={earthquake.properties.magType}
                                    magnitudeTypeTooltip={getMagnitudeTypeTooltip(earthquake.properties.magType)}
                                    depth={earthquake.geometry.coordinates[2]}
                                    intent={getIntent(earthquake.properties.alert)}
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
    intent: Intent;
};

const Alert = ({ time, place, magnitude, magnitudeType, magnitudeTypeTooltip, depth, intent }: AlertProps) => {
    const date = new Date(time);

    return (
        <div className={styles.alert}>
            <Icon icon="info-sign" intent={intent} />
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
        </>
    );
};