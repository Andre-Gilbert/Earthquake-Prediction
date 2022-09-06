import GitHub from '@assets/github-logo.png';
import { Classes } from '@blueprintjs/core';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.scss';

export const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={`${Classes.DARK} ${styles.container}`}>
                <p className={styles.logo}>Earthquake Prediction</p>
                <Link href="https://github.com/Andre-Gilbert/Earthquake-Prediction.git">
                    <a className={styles.github}>
                        <Image src={GitHub} alt="GitHub Logo" priority />
                    </a>
                </Link>
            </div>
        </div>
    );
};
