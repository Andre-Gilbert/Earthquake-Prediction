import Google from '@assets/google-logo.svg';
import { Classes, H1 } from '@blueprintjs/core';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import styles from './Hero.module.scss';

export const HeroSection = () => {
    const handleSignIn = () => signIn('google', { callbackUrl: '/dashboard' });

    return (
        <>
            <Background />
            <div className={styles.hero}>
                <div className={`${Classes.DARK}`}>
                    <H1 className={styles.title}>Earthquake Prediction</H1>
                    <p className={styles.subtitle}>Sign-in with Google. We won&apos;t post anything anywhere.</p>
                    <div className={styles.btn}>
                        <button className={styles.login} onClick={handleSignIn}>
                            <div className={styles.google}>
                                <Image src={Google} alt="Google Logo" />
                            </div>
                            <p className={styles.btnText}>Google</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const Background = () => {
    return <div className={styles.gradient}></div>;
};
