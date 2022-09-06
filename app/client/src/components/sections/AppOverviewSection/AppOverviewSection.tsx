import Analytics from '@assets/analytics.svg';
import Location from '@assets/location.svg';
import World from '@assets/world.svg';
import { H1 } from '@blueprintjs/core';
import Image from 'next/image';
import styles from './AppOverview.module.scss';

export const AppOverviewSection = () => {
    return (
        <div className={styles.overview}>
            <div className={styles.container}>
                <H1 className={styles.title}>Overview</H1>
                <p className={styles.subtitle}>text</p>
                <div className={styles.flex}>
                    <div className={styles.card}>
                        <Image src={World} alt="world" width="120" height="120" />
                    </div>
                    <div className={styles.card}>
                        <Image src={Analytics} alt="analytics" width="120" height="120" />
                    </div>
                    <div className={styles.card}>
                        <Image src={Location} alt="location" width="120" height="120" />
                    </div>
                </div>
            </div>
        </div>
    );
};
