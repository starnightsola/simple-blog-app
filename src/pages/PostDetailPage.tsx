import { useParams } from 'react-router-dom'
import { Box, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Button, Skeleton, SkeletonText,Flex } from '@chakra-ui/react'
import type { Post } from '../types/Post'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import styles from './PostDetail.module.css'
import loadingStyles from './Loading.module.css'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'


const PostDetailPage = () => {
  
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 非同期関数を先に定義
  const fetchPost = async (): Promise<Post> => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`)
    if (!res.ok) throw new Error('記事の取得に失敗しました')
    return res.json()
  }

  // useQuery で記事詳細を取得
  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: fetchPost,
    enabled: !!postId, // postIdがない場合は実行しない
  })

  // 削除処理を定義
  const handleDelete = async () => {
    const confirmed = window.confirm('本当にこの記事を削除してもよいですか？')
    // 「キャンセルされたら、そこで関数を抜けて何もしない」という早期リターンの書き方です。
    if (!confirmed) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,{
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('削除に失敗しました')
      }

      // キャッシュを無効化して一覧再取得
      await queryClient.invalidateQueries({ queryKey: ['posts'] as const })

      // 成功したら一覧ページへ移動
      navigate('/')
    } catch (err) {
      alert('削除中にエラーが発生しました')
      console.error
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box>
        <h2 className={styles.title}>記事詳細</h2>
        {/* 🔄 ローディング表示 */}
        {isLoading && (
          <Box className={loadingStyles.loadingBox}>
            <Box p={4} borderWidth="1px" borderRadius="md">
              <Skeleton height="32px" mb={4} />
              <SkeletonText
                noOfLines={4}
                spacing="4"
                skeletonHeight="3"
                startColor="gray.100"
                endColor="gray.300"
              />
            </Box>
          </Box>
        )}
        {/* ⚠️ エラー表示 + 再試行ボタン */}
        {isError && (
          <Alert
            status="error"
            mb={4}
            flexDirection="column"
            alignItems="start"
            borderRadius="md"
          >
            <AlertIcon />
            <Box>
              <AlertTitle mb={1}>エラーが発生しました</AlertTitle>
              <AlertDescription>{(error as Error).message}</AlertDescription>
            </Box>
            <Button size="sm" mt={3} onClick={() => refetch()}>
              再試行
            </Button>
          </Alert>
        )}
        {/* 読み込みが終わっていて（!loading）、エラーもなく（!error）、データも取得できている（postが存在する）ときに実行。 */}
        {/* ✅ 記事表示 */}
        {!isLoading && !isError && post && (
          <div className={styles.postCard}>
            <Text fontWeight="bold" fontSize="xl" className={styles.postTitle} data-testid="post-title-detail">
              {post.title}
            </Text>
            <Text whiteSpace="pre-line" data-testid="post-content">{post.content}</Text>

            <Flex mt={4} justify="space-between">
              {/* 編集ボタンを追加 */}
              <Button
                as={RouterLink}
                to={`/posts/${postId}/edit`}
                colorScheme="blue"
                variant="solid"
                mt={4}
              >
                編集する
              </Button>
              
              {/* 🔽 削除ボタン追加 */}
              <Button colorScheme="red" mt={4} onClick={handleDelete}>
                記事を削除
              </Button>
            </Flex>
          </div>
        )}
        
        
        {/* ⬅️ 一覧に戻るリンク */}
        <Box mt={8}>
          <Link as={RouterLink} to="/" color="#7089A5">
            ← 記事一覧に戻る
          </Link>
        </Box>
      </Box>
    </motion.div>
  )
}

export default PostDetailPage