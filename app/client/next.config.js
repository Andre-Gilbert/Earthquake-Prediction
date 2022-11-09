/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    async rewrites() {
        return [
            {
                source: '/api/v1/earthquakes/predict-magnitudes',
                destination: 'https://earthquake-prediction.onrender.com/api/v1/earthquakes/predict-magnitudes',
            },
        ];
    },
};

module.exports = nextConfig;
