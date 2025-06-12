import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Spinner, Text, Button, Box, Heading, Input, Textarea } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Post } from "../types/Post" // Post型を使用

// 記事を1件取得する関数（fetch API 使用）
const fetchPost = async (postId: string): Promise<Post> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`)
  if (!res.ok) throw new Error('記事の取得に失敗しました')
  return res.json()
}

const EditPostPage = () => {
    // URLパラメータから postId を取得
    const { id: postId } = useParams<{ id: string }>()
    const navigate = useNavigate()

    // useQuery を使って記事データを取得
    const { data: post, isLoading, isError, error } = useQuery({
        queryKey: ['post', postId],         // キャッシュキー
        queryFn: () => fetchPost(postId!),  // 非同期関数
        enabled: !!postId,                  // postId があるときのみ実行
    })

    // 編集フォーム用に状態管理
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const queryClient = useQueryClient()

    // post取得後、初期値をstateにセット（1回のみ）
    useEffect(() => {
        if (post) {
        setTitle(post.title)
        setContent(post.content)
        }
    }, [post])

    // フォーム送信時の処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ // 入力内容を送信
                    title,
                    content,
                }),
            })
            if (!res.ok) throw new Error('更新に失敗しました')

            await queryClient.invalidateQueries({ queryKey: ['posts'] as const })
            // 成功後、詳細ページへリダイレクト
            navigate(`/posts/${postId}`)
        } catch (err) {
            alert('更新エラー')
            console.error(err)
        }
    }

    // ローディング中はスピナー表示
    if (isLoading) return <Spinner />

    // エラー時はメッセージを表示
    if (isError) return <Text color="red.500">{(error as Error).message}</Text>
    
    // 記事編集フォーム（取得成功時）
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box>
                <Heading mb={4}>記事を編集</Heading>
                <form onSubmit={handleSubmit}>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タイトル" mb={4} />
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="本文" mb={4} rows={6} />
                    <Button type="submit" colorScheme="blue">更新</Button>
                </form>
            </Box>
        </motion.div>
    )
}
export default EditPostPage