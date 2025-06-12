import { Box, FormControl, FormLabel, Heading, VStack, Textarea, Button} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'

const NewPostPage = () => {
    // 入力されたタイトルと本文の状態を管理
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    //　フォームの送信状態
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }), //フォームの中身を送る
            })

            if (!res.ok) {
                throw new Error('記事の作成に失敗しました')
            }

            const data = await res.json()
            console.log('送信成功：', data)

            // ✅ 投稿成功後にキャッシュを無効化
            await queryClient.invalidateQueries({ queryKey: ['posts'] as const })
            // 投稿成功後に記事一覧ページに移動（任意）
            navigate('/') //← useNavigate() を使っている場合
        }catch (err) {
            console.error('送信エラー：', err)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box maxW="600px" mx="auto">
                <Heading mb={6}>新規記事作成</Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel>タイトル</FormLabel>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='記事のタイトル'
                                data-testid="title-input"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>本文</FormLabel>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder='本文を入力'
                                rows={6}
                                data-testid="content-input"
                            />
                        </FormControl>
                        <Button type='submit' colorScheme='blue' data-testid="submit-button">
                            投稿する
                        </Button>
                    </VStack>
                </form>
            </Box>
        </motion.div>
    )
}
export default NewPostPage