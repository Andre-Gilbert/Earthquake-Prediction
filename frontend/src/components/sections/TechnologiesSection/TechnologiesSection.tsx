import { H1 } from '@blueprintjs/core';
import styles from './Technologies.module.scss';

export const TechnologiesSection = () => {
    return (
        <div className={styles.technologies}>
            <div className={styles.container}>
                <H1 className={styles.title}>Technologies</H1>
            </div>
        </div>
    );
};
