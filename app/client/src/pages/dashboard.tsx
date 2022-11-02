import { Layout } from '@layout/Layout';
import { EarthquakesAlertsSection } from '@sections/EarthquakesAlertsSection/EarthquakesAlertsSection';
import { EarthquakesKPIsSection } from '@sections/EarthquakesKPIsSection/EarthquakesKPIsSection';
import { EarthquakesMapSection } from '@sections/EarthquakesMapSection/EarthquakesMapSection';
import { BlueprintNavbar } from '@ui/Blueprint/BlueprintNavbar';
import { getServerAuthSession } from 'common/get-server-auth-session';
import { GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';
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
    const session = await getServerAuthSession(ctx);

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
