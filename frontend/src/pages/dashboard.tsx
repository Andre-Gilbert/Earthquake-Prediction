/** The dashboard page. */
import { Layout } from '@layout/Layout';
import { BlueprintNavbar } from '@ui/Blueprint/BlueprintNavbar';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { ReactElement } from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import { NextPageWithLayout } from './_app';

const Dashboard: NextPageWithLayout = () => {
    return <div>Dashboard</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);

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

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BlueprintNavbar />
            {page}
        </Layout>
    );
};

export default Dashboard;
