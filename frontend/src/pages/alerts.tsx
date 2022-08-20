import { Layout } from '@layout/Layout';
import { BlueprintNavbar } from '@ui/Blueprint/BlueprintNavbar';
import { GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';
import { getAuthSession } from './api/auth/[...nextauth]';
import { NextPageWithLayout } from './_app';

const Alerts: NextPageWithLayout = () => {
    return <div>Alerts</div>;
};

Alerts.getLayout = function getLayout(page: ReactElement) {
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

export default Alerts;
