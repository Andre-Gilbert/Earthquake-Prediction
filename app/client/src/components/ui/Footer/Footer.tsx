import { Classes } from '@blueprintjs/core';
import styles from './Footer.module.scss';

export const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.container}>
                <p className={`${Classes.TEXT_MUTED} ${styles.copyright}`}>
                    © 2022 Earthquake Prediction, All rights reserved.
                </p>
            </div>
        </div>
    );
};
