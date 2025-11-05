Step 1: Project Setup (TypeScript)

npm create vite@latest blog-app -- --template react-ts
cd blog-app
npm install react-router-dom axios @tanstack/react-query
npm install tailwindcss @tailwindcss/vite      
npm install -D autoprefixer vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest jsdom

Step 2: vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
})

index.css
@import "tailwindcss";


