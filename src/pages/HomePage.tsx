import { useState, useEffect } from 'react'
import { Text, Box, Alert, AlertIcon, Button, AlertTitle, AlertDescription, Skeleton, SkeletonText } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import type { Post } from '../types/Post' // 型を別ファイルに定義している場合
// import type { User } from '../types/User'
import styles from './HomePage.module.css'
import loadingStyles from './Loading.module.css'
import { motion } from 'framer-motion'

const HomePage = () => {
  // 状態（データや表示の状況）を管理する
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // error という状態を作ります。この値は string 型か null のどちらかになります。初期値は null にしておきます。

  
  const fetchPosts = async () => {
    try {
      // `fetch` を使って、外部APIにGETリクエストを送信。
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`)

      // res.ok はステータスコードが 200系かどうか（成功かどうか）を示します。
      if (!res.ok) throw new Error('記事の取得に失敗しました')

      // JSON形式に変換
      const data = await res.json()
      setPosts(data)

      // try 内でエラーが発生したときに、代わりに実行される処理
      // unknown 型は「何が来るか分からないから、ちゃんと中身を調べてね」という安全な型です。
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('予期しないエラーが発生しました')
      }
    } finally {
      setLoading(false)
      //  読み込みが終わったのでスピナーを消す
    }
  }
  const handleRetry = () => {
    setError(null)
    setLoading(true)
    fetchPosts()
  }
  useEffect(() => {
    fetchPosts()
  }, [])

  
  
  // ページ情報を追加
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 8

  // ページごとに表示する記事を切り出す
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  // ページ数の配列を作成
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);

        if (!res.ok) throw new Error('❌ エラーコード: ' + res.status);

        const data = await res.json();
        console.log('✅ データ取得成功:', data);
      } catch (err) {
        console.error('❌ fetch error:', err);
      }
    };

    // 2秒後に実行（Renderがスリープ中の対策）
    const timeout = setTimeout(fetchPosts, 2000);
    return () => clearTimeout(timeout);
  }, []);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box>
          <h2 className={styles.title}>記事一覧</h2>

          {/* `loading` が `true` のときだけ `<Spinner>`（読み込み中のぐるぐる）を表示 */}
          {/* 🔄 ローディング表示 */}
          {loading && (
            <Box className={loadingStyles.loadingBox}>
              <Skeleton height="32px" mb={4} />
              <SkeletonText
                noOfLines={4}
                spacing="4"
                skeletonHeight="3"
                startColor="gray.100"
                endColor="gray.300"
              />
            </Box>
          )}
         

          {/* ⚠️ エラー表示 + 再試行ボタン */}
          {error && (
            <Alert status="error" mb={4} flexDirection="column" alignItems="start" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle mb={1}>記事の取得に失敗しました</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
              <Button size="sm" mt={3} onClick={handleRetry}>
                再試行
              </Button>
            </Alert>
          )}
          <div className={styles.grid}>
            {/* !loading → 読み込みが終わったら */}
            {!loading &&
              // !error → エラーが起きていなければ
              !error &&
              //   posts.map(...) → 記事一覧を1件ずつ表示
              currentPosts.map((post) => (
                <div key={post.id} className={styles.postCard}>
                  <Link
                    as={RouterLink}
                    to={`/posts/${post.id}`}
                    
                  >
                    <Text className={styles.postTitle} isTruncated fontWeight="bold"
                    fontSize="lg">
                      {post.title}
                    </Text>
                    <Text noOfLines={2}>{post.content}</Text>
                  </Link>
                </div>
              ))}
          </div>
          <Box mt={8} textAlign="center">
            <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} mr={2} isDisabled={currentPage === 1}>
              Prev
            </Button>
            {pageNumbers.map((num) => (
              <Button
                key={num}
                onClick={() => setCurrentPage(num)}
                colorScheme={num === currentPage ? "blue" : "gray"}
                mr={1}
              >
                {num}
              </Button>
            ))}
            <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} ml={2} isDisabled={currentPage === totalPages}>
              Next
            </Button>
          </Box>
      </Box>
    </motion.div>
  )
}

export default HomePage