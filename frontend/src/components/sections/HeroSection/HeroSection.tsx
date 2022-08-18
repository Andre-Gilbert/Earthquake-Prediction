import { Classes, H1 } from '@blueprintjs/core';
import Google from '@images/google-logo.svg';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import styles from './HeroSection.module.scss';

export const HeroSection = () => {
    const handleSignIn = () => signIn('google', { callbackUrl: '/dashboard' });

    return (
        <>
            <Background />
            <div className={styles.hero}>
                <div className={`${Classes.DARK}`}>
                    <H1 className={styles.title}>Earthquake Prediction</H1>
                    <p className={styles.subtitle}>A lot of text</p>
                    <div className={styles.btn}>
                        <button className={styles.login} onClick={handleSignIn}>
                            <div className={styles.google}>
                                <Image src={Google} alt="Google Logo" />
                            </div>
                            <p className={styles.btnText}>Sign in with Google</p>
                        </button>
                    </div>
                </div>
            </div>
            ;
        </>
    );
};

const Background = () => {
    return <div className={styles.gradient}></div>;
};
