/** The layout component of the app. */
import { Footer } from '@ui/Footer/Footer';
import { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
            <Footer />
        </>
    );
};
