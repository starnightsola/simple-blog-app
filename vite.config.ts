import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),visualizer({
      filename: './dist/report.html', // 出力ファイル名（任意）
      open: true,                     // ビルド後に自動で開く
      gzipSize: true,                 // gzipサイズも表示
      brotliSize: true                // brotliサイズも表示
    })],
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