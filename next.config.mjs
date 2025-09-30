/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }
    
    // Exclude Web3Modal and related packages from server-side bundling
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        '@web3modal/wagmi': 'commonjs @web3modal/wagmi',
        '@web3modal/base': 'commonjs @web3modal/base',
        '@web3modal/wallet': 'commonjs @web3modal/wallet',
        '@walletconnect/ethereum-provider': 'commonjs @walletconnect/ethereum-provider',
        '@walletconnect/universal-provider': 'commonjs @walletconnect/universal-provider',
        '@walletconnect/sign-client': 'commonjs @walletconnect/sign-client',
        '@walletconnect/core': 'commonjs @walletconnect/core',
        '@walletconnect/keyvaluestorage': 'commonjs @walletconnect/keyvaluestorage',
        'wagmi': 'commonjs wagmi',
        '@tanstack/react-query': 'commonjs @tanstack/react-query',
        'viem': 'commonjs viem',
        '@react-native-async-storage/async-storage': 'commonjs @react-native-async-storage/async-storage',
      })
    }
    
    return config
  },
  transpilePackages: ['@web3modal/wagmi', '@web3modal/base', '@web3modal/wallet'],
}

export default nextConfig
