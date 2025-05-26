import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Spinner, Text, Button, Box, Heading, Input, Textarea } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

const EditPostPage = () => {
    const { id: postId } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const navigate = useNavigate()

    // ▼ ① フォーム送信イベント
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            })
            if(!res.ok){
                throw new Error('更新に失敗しました')
            }

            const data = await res.json()
            console.log('✅ 更新成功:', data)

            // 成功後、詳細ページにリダイレクト
            navigate(`/posts/${postId}`)
        } catch (err) {
            console.error('送信エラー:', err)
        }
    }

    // ▼ ② データ取得処理
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${postId}`)
                if(!res.ok) {
                    throw new Error('記事の取得に失敗しました')
                }
                const data = await res.json()

                // 取得後に title, content にセット
                setTitle(data.title)
                setContent(data.content)
            } catch (err) {
                setError('記事取得エラー')
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [postId])

    // 読み込み中はぐるぐるマーク表示
    if (loading) {
        return <Spinner />
    }

    // エラーがある場合、エラーメッセージを表示
    if (error) {
        return <Text color="red.500">{error}</Text>
    }

    //記事情報が取得できたら、画面にタイトルと本文を表示
    return (
        <Box>
            <Heading mb={4}>記事を編集</Heading>
            <form onSubmit={handleSubmit}>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タイトル" mb={4} />
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="本文" mb={4} rows={6} />
                <Button type="submit" colorScheme="blue">更新</Button>
            </form>
        </Box>
    )
}
export default EditPostPage