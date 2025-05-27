import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    colors: {
        primary: {
          100: '#6E85B7', // 任意のキー（100〜900など）
        },
      },
    fonts: {
        heading: `'Noto Sans JP', sans-serif`,
        body: `'Noto Sans JP', sans-serif`,
    },
})

export default theme