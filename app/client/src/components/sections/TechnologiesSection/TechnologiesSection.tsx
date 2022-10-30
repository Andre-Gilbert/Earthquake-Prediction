import { H1 } from '@blueprintjs/core';
import dynamic from 'next/dynamic';
import styles from './Technologies.module.scss';

const CubeAnimation = dynamic(() => import('@sections/TechnologiesSection/CubeAnimation'), { ssr: false });

export const TechnologiesSection = () => {
    return (
        <div className={styles.technologies}>
            <div className={styles.container}>
                <div className={styles.flex}>
                    <div className={styles.grid}>
                        <H1 className={styles.title}>Technologies</H1>
                        <p className={styles.subtitle}>
                            All technologies used. Now that we have invested in this tech stack, what is the ROI? That
                            is a good question for a new analytics tool we should buy. Yes, and a new layer for data
                            visualization.
                        </p>
                        <TechStack />
                    </div>
                    <CubeAnimation />
                </div>
            </div>
        </div>
    );
};

const TECH_STACK = [
    { id: 1, title: 'TypeScript', subtitle: 'for all you Edgy JavaScripters', image: '' },
    { id: 2, title: 'Python', subtitle: 'for all you Data Scientists', image: '' },
    { id: 3, title: 'Next.js', subtitle: 'text', image: '' },
    { id: 4, title: 'NextAuth.js', subtitle: 'text', image: '' },
    { id: 5, title: 'React Query', subtitle: 'text', image: '' },
    { id: 6, title: 'FastAPI', subtitle: 'for all you performance fanatics', image: '' },
    { id: 7, title: 'Catboost', subtitle: 'for all you ', image: '' },
    { id: 8, title: 'Docker', subtitle: 'for all you Moby-Dick lovers', image: '' },
];

const TechStack = () => {
    return (
        <div className={styles.techStackContainer}>
            {TECH_STACK.map(tech => (
                <div className={styles.techStack} key={tech.id}>
                    image <b>{tech.title}</b>, {tech.subtitle}
                </div>
            ))}
        </div>
    );
};
