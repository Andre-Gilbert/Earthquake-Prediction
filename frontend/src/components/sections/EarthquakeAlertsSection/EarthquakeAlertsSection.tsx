import { Button, Card, H5, Icon } from '@blueprintjs/core';
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

const Alerts = ({ alerts }: AlertsProps) => {
    return (
        <>
            {alerts.map(alert =>
                alert.data.features.map(
                    (earthquake: any) =>
                        earthquake.properties.place && (
                            <Alert key={earthquake.id} title={earthquake.properties.place} />
                        ),
                ),
            )}
        </>
    );
};

type AlertProps = { title: string };

const Alert = ({ title }: AlertProps) => {
    return (
        <div className={styles.alert}>
            <div>{title}</div>
        </div>
    );
};
