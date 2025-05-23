import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api から始まるURLへのリクエストを対象にする
      '/api': {
        // 実際に転送する先。ここでは Express が動いてる http://localhost:3000
        target: 'http://localhost:3000',// バックエンドのURL（Express）
        // リクエストヘッダーのオリジンをターゲットに合わせる（CORS対策）
        changeOrigin: true,             // オリジン（ホスト名）を変える
        // 転送時に /api をそのまま使う。ここでは /api/posts → /api/posts のまま
        rewrite: path => path.replace(/^\/api/, '/api')// パスを書き換える
      },
    },
  },
})