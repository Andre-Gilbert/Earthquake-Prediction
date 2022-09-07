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
                        <p className={styles.subtitle}>text</p>
                        <TechStack />
                    </div>
                    <CubeAnimation />
                </div>
            </div>
        </div>
    );
};

const TECH_STACK = [
    { id: 1, title: 'TypeScript', subtitle: 'text', image: '' },
    { id: 2, title: 'Python', subtitle: 'text', image: '' },
    { id: 3, title: 'Next.js', subtitle: 'text', image: '' },
    { id: 4, title: 'NextAuth.js', subtitle: 'text', image: '' },
    { id: 5, title: 'React Query', subtitle: 'text', image: '' },
    { id: 6, title: 'FastAPI', subtitle: 'text', image: '' },
    { id: 7, title: 'Catboost', subtitle: 'text', image: '' },
];

const TechStack = () => {
    return (
        <div>
            {TECH_STACK.map(tech => (
                <div key={tech.id}>
                    <b>{tech.title}</b>, tech.subtitle
                </div>
            ))}
        </div>
    );
};
