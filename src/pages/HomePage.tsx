import { useState } from 'react'
import { Text, Box, Alert, AlertIcon, Button, AlertTitle, AlertDescription, Skeleton, SkeletonText } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import type { Post } from '../types/Post' // 型を別ファイルに定義している場合
// import type { User } from '../types/User'
import styles from './HomePage.module.css'
import loadingStyles from './Loading.module.css'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`)
  if (!res.ok) throw new Error('記事の取得に失敗しました')
  return res.json()
}
const HomePage = () => {
  // 状態（データや表示の状況）を管理する
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })
  
  
  // ページ情報を追加
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 12

  // ページごとに表示する記事を切り出す
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  // ページ数の配列を作成
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)


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
          {isLoading && (
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
          {isError && (
            <Alert status="error" mb={4} flexDirection="column" alignItems="start" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle mb={1}>記事の取得に失敗しました</AlertTitle>
                <AlertDescription>{(error as Error).message}</AlertDescription>
              </Box>
              <Button size="sm" mt={3} onClick={() => refetch()}>
                再試行
              </Button>
            </Alert>
          )}
          <div className={styles.grid}>
            {/* !loading → 読み込みが終わったら */}
            {!isLoading &&
              // !error → エラーが起きていなければ
              !isError &&
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