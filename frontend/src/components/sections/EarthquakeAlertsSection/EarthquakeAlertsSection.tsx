import { Button, Card, Classes, H5, Icon } from '@blueprintjs/core';
import { UseQueryResult } from '@tanstack/react-query';
import { useEarthquakeAlerts } from 'queries/earthquakes';
import styles from './EarthquakeAlerts.module.scss';

export const EarthquakeAlertsSection = () => {
    const earthquakeAlertsQuery = useEarthquakeAlerts(30);

    return (
        <div className={styles.alerts}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Header />
                    <Alerts query={earthquakeAlertsQuery} />
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

type QueryProps = {
    query: UseQueryResult<any, unknown>;
};

const Alerts = ({ query }: QueryProps) => {
    console.log(query.data);

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
