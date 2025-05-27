import { useState, useEffect } from 'react'
import { Spinner, Text, Box, Alert, AlertIcon, Button, AlertTitle, AlertDescription, Select } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import type { Post } from '../types/Post' // 型を別ファイルに定義している場合
import type { User } from '../types/User'
import styles from './HomePage.module.css'
import loadingStyles from './Loading.module.css'
import { motion } from 'framer-motion'

const HomePage = () => {
  // 状態（データや表示の状況）を管理する
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // error という状態を作ります。この値は string 型か null のどちらかになります。初期値は null にしておきます。

  // お気に入り記事だけを絞り込んで表示するボタンを一覧ページに追加しよう！
  const [showFavorites, setShowFavorites] = useState(false)

  // 記事一覧ページ（HomePage）に、特定のユーザーの投稿だけを表示するセレクトボックスを追加
  // ユーザー一覧（セレクト用の選択肢）
  const [users, setUsers] = useState<User[]>([])
  // 選択されたユーザーID（フィルター用）
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  // フィルターを合体させる
  const filteredPosts = posts
    .filter((post) => selectedUserId === null || post.userId === selectedUserId)
    .filter((post) => !showFavorites || post.id <= 5)


  
  const fetchPosts = async () => {
    try {
      // `fetch` を使って、外部APIにGETリクエストを送信。
      const res = await fetch('/api/posts')

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
  
  
  const handleUserChange = (
    e: React.ChangeEvent<HTMLSelectElement> // ← 型ヒント（ChakraのSelectもこれ）
  ) => {
    const value = e.target.value
    setSelectedUserId(value === "" ? null : Number(value))
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users')

      if (!res.ok) {
        throw new Error('データの取得に失敗しました')  // 明示的にエラーを投げる
      }

      const data = await res.json()
      setUsers(data)
    } catch (err: unknown) {
      // ネットエラーや throw new Error() の処理がここに来る
      console.error('取得失敗:', err)
    }
  }
  useEffect(() => {
    fetchUsers()
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box>
          <h2 className={styles.title}>記事一覧</h2>

          {/* `loading` が `true` のときだけ `<Spinner>`（読み込み中のぐるぐる）を表示 */}
          {/* 🔄 ローディング表示 */}
          {loading && (
            <Box className={loadingStyles.loadingBox}>
              <Spinner size="lg" />
              <Text className={loadingStyles.spinnerText}>記事を読み込み中です...</Text>
            </Box>
          )}
          {!loading && (
            <Select placeholder="ユーザーを選択" onChange={handleUserChange} mb={4}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          )}
          <Button onClick={() => setShowFavorites(!showFavorites)} mb={4}>
            {showFavorites ? 'すべて表示' : 'お気に入りのみ'}
          </Button>

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
              filteredPosts.map((post) => (
                <div key={post.id} className={styles.postCard}>
                  <Link
                    as={RouterLink}
                    to={`/posts/${post.id}`}
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    <Text className={styles.postTitle} isTruncated>
                      {post.title}
                    </Text>
                  </Link>
                  <Text noOfLines={2}>{post.content}</Text>
                </div>
              ))}
          </div>
      </Box>
    </motion.div>
  )
}

export default HomePage