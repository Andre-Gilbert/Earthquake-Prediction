import Google from '@assets/google-logo.svg';
import { Classes, H1 } from '@blueprintjs/core';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { Line } from 'react-chartjs-2';
import styles from './Hero.module.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartOptions = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    plugins: {
        legend: {
            position: 'top' as const,
            labels: { color: 'rgb(255, 255, 255, 0.4)' },
        },
    },
    stacked: false,
    scales: {
        xAxes: {
            grid: { color: 'rgb(255, 255, 255, 0.2)' },
            ticks: {
                color: 'rgb(255, 255, 255, 0.4)',
            },
        },
        y: {
            display: true,
            min: -1,
            max: 10,
            grid: { color: 'rgb(255, 255, 255, 0.2)' },
            ticks: {
                color: 'rgb(255, 255, 255, 0.4)',
                stepSize: 0.5,
            },
        },
        y1: { display: false, min: -1, max: 10 },
    },
    maintainAspectRatio: false,
};

export const HeroSection = () => {
    const handleSignIn = () => signIn('google', { callbackUrl: '/dashboard' });

    const data = {
        labels: ['01/01/2022', '02/01/2022', '03/01/2022', '04/01/2022', '05/01/2022', '06/01/2022', '07/01/2022'],
        datasets: [
            {
                label: 'Prediction',
                data: [-0.5, 2.0, 4.0, 2.0, 6.0, 3.5, 2.0],
                yAxisID: 'y',
                borderColor: 'rgb(255, 99, 132, 0.75)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Magnitude',
                data: [0.5, 3.0, 3.0, 2.0, 4.0, 4.5, 1.0],
                yAxisID: 'y1',
                borderColor: 'rgb(53, 162, 235, 0.75)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

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
                                magnitudes of earthquakes. Try it out. We won&apos;t post anything anywhere.
                            </p>
                            <div className={styles.btn}>
                                <button className={styles.login} onClick={handleSignIn}>
                                    <div className={styles.google}>
                                        <Image src={Google} alt="Google Logo" priority />
                                    </div>
                                    <p className={styles.btnText}>Sign in with Google</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.appDesign}>
                        <div className={styles.appDesignContainer}>
                            <div className={styles.appDesignPerspective}>
                                <div className={styles.app}>
                                    <div className={styles.appComponents}>
                                        <div className={styles.appNavbar}>
                                            <div className={styles.close} />
                                            <div className={styles.minimize} />
                                            <div className={styles.maximize} />
                                        </div>
                                        <div className={styles.appChart}>
                                            <Line options={chartOptions} data={data} height={200} />
                                        </div>
                                        <div className={styles.appPrediction}>
                                            <div className={styles.appListItem}>
                                                <div />
                                                <div />
                                                <div />
                                            </div>
                                            <div className={styles.appListItem}>
                                                <div />
                                                <div />
                                                <div />
                                            </div>
                                            <div className={styles.appListItem}>
                                                <div />
                                                <div />
                                                <div />
                                            </div>
                                            <div className={styles.appListItem}>
                                                <div />
                                                <div />
                                                <div />
                                            </div>
                                            <div className={styles.appListItem}>
                                                <div />
                                                <div />
                                                <div />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
