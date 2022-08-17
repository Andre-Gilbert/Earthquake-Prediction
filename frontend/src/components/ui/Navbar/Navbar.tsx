import { Classes } from '@blueprintjs/core';
import GitHub from '@images/github-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.scss';

export const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={`${Classes.DARK} ${styles.container}`}>
                <p className={styles.logo}>Earthquake Prediction</p>
                <Link href="https://github.com/Andre-Gilbert/Earthquake-Prediction.git">
                    <Image src={GitHub} alt="GitHub Logo" priority />
                </Link>
            </div>
        </div>
    );
};
