import { useState } from 'react'
import { Text, Box, Alert, AlertIcon, Button, AlertTitle, AlertDescription, Skeleton, SkeletonText } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import type { Post } from '../types/Post' // 型を別ファイルに定義している場合
// import type { User } from '../types/User'
import styles from './HomePage.module.css'
import loadingStyles from './Loading.module.css'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query';

// APIから記事データを取得する関数（ページネーション付き）
const fetchPosts = async (page: number, limit: number): Promise<{
  posts: Post[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts?page=${page}&limit=${limit}`)
  if (!res.ok) throw new Error('記事の取得に失敗しました')
  return res.json()
}

// 詳細取得関数を定義
const fetchPostDetail = async (postId: number): Promise<Post> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`);
  if (!res.ok) throw new Error('記事詳細の取得に失敗しました');
  return res.json();
};
const HomePage = () => {
  // 現在のページ番号を状態として管理
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 12 // 1ページあたりに表示する記事数

  // クエリクライアントを取得（← ここで取得）
  const queryClient = useQueryClient();

  // 詳細データのプリフェッチ関数を定義
  const prefetchPostDetail = (postId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['post', postId],
      queryFn: () => fetchPostDetail(postId),
      staleTime: 1000 * 60 * 5, // 任意：キャッシュの有効時間
    });
  };

  // useQueryで記事一覧を取得（ページ番号と件数を指定）
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<{
    posts: Post[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>({
    queryKey: ['posts', currentPage], // キャッシュキーにページ番号も含める
    queryFn: () => fetchPosts(currentPage, postsPerPage),
    select: (data) => ({
      ...data,
      posts: data.posts.map(post => ({
        ...post, // すべてのプロパティを残す
      })),
    }),
    staleTime: 1000 * 60 * 5, // キャッシュの鮮度を保持（任意）
    gcTime: 1000 * 60 * 10, // ガーベジコレクションまでの時間（任意）
    placeholderData: {
      posts: Array.from({ length: postsPerPage }).map((_, i) => ({
        id: i,
        userId: 0,  // 仮のユーザーID（固定値）
        title: 'Loading...',
        body: '',
        content: '',
      })),
      page: currentPage,
      limit: postsPerPage,
      total: 0,
      totalPages: 1,
    },
  })

  // アニメーション用バリアント（親要素）
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 子要素を少しずつ遅らせて表示
      },
    },
  }


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
        <div className={styles.grid}>
          {isLoading && (
            Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} className={loadingStyles.loadingBox}>
                <Skeleton height="32px" mb={4} />
                <SkeletonText
                  noOfLines={4}
                  spacing="4"
                  skeletonHeight="3"
                  startColor="gray.100"
                  endColor="gray.300"
                />
              </Box>
            ))
          )}
        </div>
        
         

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
        <motion.div
          key={isLoading ? 'loading' : 'loaded'}
          className={styles.grid}
          variants={listVariants}
          initial="hidden"
          animate="visible"
          
        >
          {!isLoading && !isError && data && Array.isArray(data.posts) && data.posts.map((post) => (
            <motion.div
              key={post.id}
              className={styles.postCard}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              data-testid="post-card"
            >
              <Link
                as={RouterLink}
                to={`/posts/${post.id}`}
                onMouseEnter={() => prefetchPostDetail(post.id)}
                
              >
                <Text className={styles.postTitle} isTruncated fontWeight="bold"
                fontSize="lg" data-testid="post-title-list">
                  {post.title}
                </Text>
                <Text noOfLines={2}>{post.content}</Text>
              </Link>
            </motion.div>
          ))}
        </motion.div>
          {/* 🔁 ページネーションボタン */}
        <Box mt={8} textAlign="center">
          <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} mr={2} isDisabled={currentPage === 1}>
            Prev
          </Button>
          {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((num) => (
            <Button
              key={num}
              onClick={() => setCurrentPage(num)}
              colorScheme={num === currentPage ? 'blue' : 'gray'}
              mr={1}
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, data?.totalPages || 1))}
            ml={2}
            isDisabled={currentPage === data?.totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>
    </motion.div>
  )
}

export default HomePage