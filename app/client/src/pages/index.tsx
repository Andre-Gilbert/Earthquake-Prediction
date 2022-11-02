import { Layout } from '@layout/Layout';
import { HeroSection } from '@sections/HeroSection/HeroSection';
import { TechnologiesSection } from '@sections/TechnologiesSection/TechnologiesSection';
import { Navbar } from '@ui/Navbar/Navbar';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
    return (
        <>
            <HeroSection />
            <TechnologiesSection />
        </>
    );
};

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <Navbar />
            {page}
        </Layout>
    );
};

export default Home;
