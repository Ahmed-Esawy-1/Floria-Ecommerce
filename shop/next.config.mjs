import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/api/upload_images/**",
            },
        ],
        unoptimized: process.env.NODE_ENV === "development",
    },
};

export default withNextIntl(nextConfig);
