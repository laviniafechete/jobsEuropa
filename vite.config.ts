import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determine if we're in development
  const isDev = command === 'serve'
  
  return {
    plugins: [react()],
    
    // Build optimizations
    build: {
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      
      // Manual chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react'],
            store: ['zustand'],
            query: ['react-query'],
          }
        }
      },
      
      // Source maps for production debugging (optional)
      sourcemap: mode === 'development',
    },
    
    // Dependency optimization
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'react-query']
    },
    
    // Development server configuration
    server: {
      port: 5173,
      host: true, // Allow external connections
      
      // Allowed hosts for security
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '.csb.app', // CodeSandbox
        'jobs-europa.com', // Production domain
        '.jobs-europa.com' // Subdomains
      ],
      
      // Proxy configuration - only in development
      ...(isDev && {
        proxy: {
          '/api': {
            target: env.VITE_API_TARGET || 'http://localhost:5001',
            changeOrigin: true,
            secure: false,
            ws: true, // Proxy WebSockets
            configure: (proxy) => {
              proxy.on('error', (err) => {
                console.log('Proxy error:', err);
              });
              proxy.on('proxyReq', (proxyReq) => {
                console.log('Sending Request to:', proxyReq.path);
              });
              proxy.on('proxyRes', (proxyRes, req) => {
                console.log('Received Response from:', req.url, 'Status:', proxyRes.statusCode);
              });
            },
          }
        }
      })
    },
    
    // Preview server configuration (for production build testing)
    preview: {
      port: 4173,
      host: true,
    },
    
    // Environment variables prefix
    envPrefix: 'VITE_',
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // CSS configuration
    css: {
      devSourcemap: isDev,
    },
    
    // ESBuild configuration
    esbuild: {
      // Remove console.log in production
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
  }
})
