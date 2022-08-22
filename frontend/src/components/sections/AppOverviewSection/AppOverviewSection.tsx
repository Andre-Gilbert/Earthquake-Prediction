import { H1 } from '@blueprintjs/core';
import styles from './AppOverview.module.scss';

export const AppOverviewSection = () => {
    return (
        <div className={styles.overview}>
            <div className={styles.container}>
                <H1 className={styles.title}>Overview</H1>
            </div>
        </div>
    );
};
