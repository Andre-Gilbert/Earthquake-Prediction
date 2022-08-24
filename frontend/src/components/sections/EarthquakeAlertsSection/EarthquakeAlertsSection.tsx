import { Button, Card, Classes, H5, Icon } from '@blueprintjs/core';
import { UseQueryResult } from '@tanstack/react-query';
import { useEarthquakeAlerts } from 'queries/earthquakes';
import { useState } from 'react';
import styles from './EarthquakeAlerts.module.scss';

export const EarthquakeAlertsSection = () => {
    const [alertLevels, setAlertLevels] = useState(['green', 'yellow', 'orange', 'red']);
    const earthquakeAlertsQueries = useEarthquakeAlerts(alertLevels, 30);

    let alerts = [];
    for (let i = 0; i < earthquakeAlertsQueries.length; i++) {
        alerts.push(earthquakeAlertsQueries[i].data);
    }

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
    console.log(alerts);
    return (
        <>
            <Alert />
            <Alert />
            <Alert />
            <Alert />
            <Alert />
        </>
    );
};

const Alert = () => {
    return (
        <div className={styles.alert}>
            <div className={Classes.SKELETON}>Content</div>
        </div>
    );
};
