import { GetServerSidePropsContext } from 'next';
import NextAuth, { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
};

export const getAuthSession = async (ctx: {
    req: GetServerSidePropsContext['req'];
    res: GetServerSidePropsContext['res'];
}) => {
    return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};

export default NextAuth(authOptions);
