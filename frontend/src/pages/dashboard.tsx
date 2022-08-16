/** The dashboard page. */
import { Layout } from '@layout/Layout';
import { BlueprintNavbar } from '@ui/Blueprint/BlueprintNavbar';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

const Dashboard: NextPageWithLayout = () => {
    return <div>Dashboard</div>;
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <BlueprintNavbar />
            {page}
        </Layout>
    );
};

export default Dashboard;
