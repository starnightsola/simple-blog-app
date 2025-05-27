import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Button, Skeleton, SkeletonText,Flex } from '@chakra-ui/react'
import type { Post } from '../types/Post'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import styles from './PostDetail.module.css'
import loadingStyles from './Loading.module.css'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // error という状態を作ります。この値は string 型か null のどちらかになります。初期値は null にしておきます。

  const navigate = useNavigate() // 🔄 追加

  // 🔁 再試行ボタンで呼び出す関数
  const fetchPost = async () => {
    if (!postId) return
    try {
      const res = await fetch(`/api/posts/${postId}`)
      if (!res.ok) throw new Error('データの取得に失敗しました')
      const data = await res.json()
      setPost(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('予期しないエラーが発生しました')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)// エラー状態をいったんリセット
    setLoading(true)// 再読み込みなので「ローディング中」にする
    fetchPost()// APIをもう一度呼び出す
  }

  // ページが開かれたとき、または postId が変わったときに fetchPost() を呼ぶ
  useEffect(() => {
    fetchPost()
  }, [postId])

  // 削除処理を定義
  const handleDelete = async () => {
    const confirmed = window.confirm('本当にこの記事を削除してもよいですか？')
    // 「キャンセルされたら、そこで関数を抜けて何もしない」という早期リターンの書き方です。
    if (!confirmed) return

    try {
      const res = await fetch(`/api/posts/${postId}`,{
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('削除に失敗しました')
      }

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
        {loading && (
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
        {error && (
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
              <AlertDescription>{error}</AlertDescription>
            </Box>
            <Button size="sm" mt={3} onClick={handleRetry}>
              再試行
            </Button>
          </Alert>
        )}
        {/* 読み込みが終わっていて（!loading）、エラーもなく（!error）、データも取得できている（postが存在する）ときに実行。 */}
        {/* ✅ 記事表示 */}
        {!loading && !error && post && (
          <div className={styles.postCard}>
            <Text fontWeight="bold" fontSize="xl" className={styles.postTitle}>
              {post.title}
            </Text>
            <Text whiteSpace="pre-line">{post.content}</Text>

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