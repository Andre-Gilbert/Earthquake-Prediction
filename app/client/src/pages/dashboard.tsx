/** The dashboard page. */
import { Layout } from '@layout/Layout';
import { EarthquakesAlertsSection } from '@sections/EarthquakesAlertsSection/EarthquakesAlertsSection';
import { EarthquakesKPIsSection } from '@sections/EarthquakesKPIsSection/EarthquakesKPIsSection';
import { EarthquakesMapSection } from '@sections/EarthquakesMapSection/EarthquakesMapSection';
import { BlueprintNavbar } from '@ui/Blueprint/BlueprintNavbar';
import { GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';
import { getAuthSession } from './api/auth/[...nextauth]';
import { NextPageWithLayout } from './_app';

const Dashboard: NextPageWithLayout = () => {
    return (
        <>
            <EarthquakesKPIsSection />
            <EarthquakesMapSection />
            <EarthquakesAlertsSection />
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
