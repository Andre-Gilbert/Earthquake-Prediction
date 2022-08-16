/** The layout component of the app. */
import { Footer } from '@ui/Footer/Footer';
import { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            {children}
            <Footer />
        </>
    );
};
