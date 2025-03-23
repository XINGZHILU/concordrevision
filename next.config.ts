import type { NextConfig } from "next";
import createMDX from '@next/mdx';
import withTM from 'next-transpile-modules';

// Create the transpile modules HOC
const withTranspileModules = withTM(['react-pdf']);

// Create the MDX HOC
const withMDX = createMDX({
    // Add markdown plugins here, as desired
});

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
    },
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

    // Add PDF viewer webpack configuration
    webpack: (config) => {
        // PDF viewer specific config - canvas needs to be false for react-pdf
        config.resolve.alias.canvas = false;

        return config;
    },

    // Add headers for PDF loading
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp',
                    },
                ],
            },
        ];
    },
};

// Compose both HOCs: first apply MDX, then apply TranspileModules
// The order is important - withTranspileModules should be the outermost wrapper
export default withTranspileModules(withMDX(nextConfig));