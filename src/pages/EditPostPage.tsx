import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Spinner, Text } from "@chakra-ui/react"


const EditPostPage = () => {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    // データ取得処理
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post/$id`)
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
    }, [id])

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
        <form>
            <div>
                <label>タイトル：</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>本文：</label>
                <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
        </form>
    )
}
export default EditPostPage