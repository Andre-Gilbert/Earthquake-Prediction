import Google from '@assets/google-logo.svg';
import { Classes, H1 } from '@blueprintjs/core';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import styles from './Hero.module.scss';

export const HeroSection = () => {
    const handleSignIn = () => signIn('google', { callbackUrl: '/dashboard' });

    return (
        <>
            <div className={styles.gradient} />
            <div className={styles.hero}>
                <div className={`${Classes.DARK} ${styles.container}`}>
                    <div className={styles.textContainer}>
                        <div className={styles.text}>
                            <H1 className={styles.title}>Earthquake Prediction</H1>
                            <p className={`${styles.subtitle} ${Classes.RUNNING_TEXT}`}>
                                This website monitors earthquakes in real time and uses machine learning to forecast the
                                magnitudes of earthquakes. Sign-in with Google. We won&apos;t post anything anywhere.
                            </p>
                            <div className={styles.btn}>
                                <button className={styles.login} onClick={handleSignIn}>
                                    <div className={styles.google}>
                                        <Image src={Google} alt="Google Logo" priority />
                                    </div>
                                    <p className={styles.btnText}>Google</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.appDesign}>Hello</div>
                </div>
            </div>
        </>
    );
};
