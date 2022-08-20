/** The dashboard page. */
import { Layout } from '@layout/Layout';
import { EarthquakesKPIsSection } from '@sections/EarthquakesKPIsSection/EarthquakesKPIsSection';
import { BlueprintNavbar } from '@ui/Blueprint/BlueprintNavbar';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { getAuthSession } from './api/auth/[...nextauth]';
import { NextPageWithLayout } from './_app';

const EarthquakesMapSection = dynamic<{}>(
    () => import('@sections/EarthquakesMapSection/EarthquakesMapSection').then(module => module.EarthquakesMapSection),
    {
        ssr: false,
    },
);

const Dashboard: NextPageWithLayout = () => {
    return (
        <>
            <EarthquakesKPIsSection />
            <EarthquakesMapSection />
        </>
    );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BlueprintNavbar />
            {page}
        </Layout>
    );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return { props: { session } };
}

export default Dashboard;
