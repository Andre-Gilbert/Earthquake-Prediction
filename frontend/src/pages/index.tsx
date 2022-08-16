/** The landing page. */
import { Layout } from '@layout/Layout';
import styles from '@styles/Home.module.scss';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
    return <div className={styles.container}></div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Home;
