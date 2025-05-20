import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Text, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, Button } from '@chakra-ui/react'
import type { Post } from '../types/Post'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import styles from './PostDetail.module.css'
import loadingStyles from './Loading.module.css'

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // error という状態を作ります。この値は string 型か null のどちらかになります。初期値は null にしておきます。

  // 🔁 再試行ボタンで呼び出す関数
  const fetchPost = async () => {
    if (!postId) return
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
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


  return (
    <Box>
      <h2 className={styles.title}>記事詳細</h2>
      {/* 🔄 ローディング表示 */}
      {loading && (
        <Box className={loadingStyles.loadingBox}>
          <Spinner size="lg" />
          <Text className={loadingStyles.spinnerText}>記事を読み込み中です...</Text>
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
          <Text whiteSpace="pre-line">{post.body}</Text>
        </div>
      )}

      {/* ⬅️ 一覧に戻るリンク */}
      <Box mt={8}>
        <Link as={RouterLink} to="/" color="#7089A5">
          ← 記事一覧に戻る
        </Link>
      </Box>
    </Box>
  )
}

export default PostDetailPage