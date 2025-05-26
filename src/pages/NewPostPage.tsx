import { Box, FormControl, FormLabel, Heading, VStack, Textarea, Button} from '@chakra-ui/react'
import { useState } from 'react'

const NewPostPage = () => {
    // 入力されたタイトルと本文の状態を管理
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    //　フォームの送信状態（仮）
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('タイトル：', title)
        console.log('本文', content)
        // あとでここにAPI連携を追加する
    }
    return (
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
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>本文</FormLabel>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder='本文を入力'
                            rows={6}
                        />
                    </FormControl>
                    <Button type='submit' colorScheme='blue'>
                        投稿する
                    </Button>
                </VStack>
            </form>
        </Box>
    )
}
export default NewPostPage