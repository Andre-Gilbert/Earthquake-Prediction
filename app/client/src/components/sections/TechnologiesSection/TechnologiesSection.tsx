import { Classes, H1 } from '@blueprintjs/core';
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
                        <p className={`${styles.subtitle} ${Classes.RUNNING_TEXT}`}>
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
    { id: 1, title: 'TypeScript', subtitle: 'for all you Edgy JavaScripters' },
    { id: 2, title: 'Python', subtitle: 'for all you Data Scientists' },
    { id: 3, title: 'Next.js', subtitle: 'the React Framework for Production' },
    {
        id: 4,
        title: 'NextAuth.js',
        subtitle: 'a complete authentication solution for Next.js',
    },
    { id: 5, title: 'React Query', subtitle: 'for powerful asynchronous state management' },
    {
        id: 6,
        title: 'FastAPI',
        subtitle: 'a fast web framework for building APIs with Python',
    },
    { id: 7, title: 'Catboost', subtitle: 'for gradient boosting on decision trees' },
    { id: 8, title: 'Docker', subtitle: 'for all you Moby-Dick lovers' },
];

const TechStack = () => {
    return (
        <div className={styles.techStackContainer}>
            {TECH_STACK.map(tech => (
                <div className={`${styles.techStack} ${Classes.RUNNING_TEXT}`} key={tech.id}>
                    <b>{tech.title}</b>, {tech.subtitle}
                </div>
            ))}
        </div>
    );
};
