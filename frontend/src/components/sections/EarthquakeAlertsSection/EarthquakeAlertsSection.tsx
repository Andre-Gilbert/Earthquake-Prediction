import { Button, Card, H5, Icon, Intent } from '@blueprintjs/core';
import { UseQueryResult } from '@tanstack/react-query';
import { useEarthquakeAlerts } from 'queries/earthquakes';
import { useMemo, useState } from 'react';
import styles from './EarthquakeAlerts.module.scss';

export const EarthquakeAlertsSection = () => {
    const [alertLevels, setAlertLevels] = useState(['green', 'yellow', 'orange', 'red']);
    const earthquakeAlertsQueries = useEarthquakeAlerts(alertLevels, 30);

    const alerts = useMemo(() => {
        return earthquakeAlertsQueries.map((query: any) => query.data).filter(data => data !== undefined);
    }, [earthquakeAlertsQueries]);

    return (
        <div className={styles.alerts}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Header />
                    <Alerts alerts={alerts} />
                </Card>
            </div>
        </div>
    );
};

const Header = () => {
    const renderInputValue = (data: any) => data.alert;

    return (
        <div className={styles.header}>
            <div className={styles.alertsTitle}>
                <Icon icon="warning-sign" />
                <H5>Earthquake Alerts</H5>
            </div>
            {/* <Suggest2 inputValueRenderer={renderInputValue} /> */}
            <Button icon="filter" minimal />
        </div>
    );
};

type AlertsProps = {
    alerts: UseQueryResult<any, unknown>[];
};

const getIntent = (alertLevel: string) => {
    switch (alertLevel) {
        case 'green':
            return Intent.SUCCESS;
        case 'yellow':
            return Intent.PRIMARY;
        case 'orange':
            return Intent.WARNING;
        case 'red':
            return Intent.DANGER;
        default:
            return Intent.NONE;
    }
};

const Alerts = ({ alerts }: AlertsProps) => {
    return (
        <>
            <div className={styles.alert}>Labels</div>
            {alerts.map(alert =>
                alert.data.features.map(
                    (earthquake: any) =>
                        earthquake.properties.place && (
                            <Alert
                                key={earthquake.id}
                                time={earthquake.properties.time}
                                place={earthquake.properties.place}
                                magnitude={earthquake.properties.mag}
                                intent={getIntent(earthquake.properties.alert)}
                            />
                        ),
                ),
            )}
        </>
    );
};

type AlertProps = { time: number; place: string; magnitude: string; intent: Intent };

const Alert = ({ time, place, magnitude, intent }: AlertProps) => {
    const date = new Date(time);

    return (
        <div className={styles.alert}>
            <Icon icon="info-sign" intent={intent} />
            <div className={styles.alertDate}>{date.toLocaleString()}</div>
            <div className={styles.alertPlace}>{place}</div>
            <div className={styles.alertMagnitude}>Magnitude: {magnitude}</div>
        </div>
    );
};
