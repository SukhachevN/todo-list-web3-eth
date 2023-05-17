/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['arweave.net', 'gateway.pinata.cloud'],
    },
};

module.exports = nextConfig;
