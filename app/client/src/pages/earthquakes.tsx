import { Layout } from '@layout/Layout';
import { EarthquakesPredictionSection } from '@sections/EarthquakesPredictionSection/EarthquakesPredictionSection';
import { BlueprintNavbar } from '@ui/Blueprint/BlueprintNavbar';
import { getServerAuthSession } from 'common/get-server-auth-session';
import { GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

const Earthquakes: NextPageWithLayout = () => {
    return (
        <>
            <EarthquakesPredictionSection />
        </>
    );
};

Earthquakes.getLayout = function getLayout(page: ReactElement) {
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

export default Earthquakes;
