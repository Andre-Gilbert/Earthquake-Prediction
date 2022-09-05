import { H1 } from '@blueprintjs/core';
import dynamic from 'next/dynamic';
import styles from './Technologies.module.scss';

const CubeAnimation = dynamic<{}>(
    () => import('@sections/TechnologiesSection/CubeAnimation').then(module => module.CubeAnimation),
    { ssr: false },
);

export const TechnologiesSection = () => {
    return (
        <div className={styles.technologies}>
            <div className={styles.container}>
                <div className={styles.flex}>
                    <div className={styles.grid}>
                        <H1 className={styles.title}>Technologies</H1>
                        <p className={styles.subtitle}>text</p>
                        <TechStack />
                    </div>
                    <CubeAnimation />
                </div>
            </div>
        </div>
    );
};

const TechStack = () => {
    return <div>Tech Stack</div>;
};
