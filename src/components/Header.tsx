import { Box, Heading, Link as ChakraLink, Flex } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const Header = () => {
  return (
    <Box as="header" bg="primary.100" py={4} px={6}>
      <Flex justify="space-between" align="center">
        <Heading size="lg" fontFamily="'Playwrite DK Loopet', cursive" color="white">Blog</Heading>
        <Flex gap={4}>
          <ChakraLink as={RouterLink} to="/" fontWeight="bold" color="white">
            Home
          </ChakraLink>
          <ChakraLink as={RouterLink} to="/posts/new" fontWeight="bold" color="white" data-testid="create-link">
            ＋ 新しい記事を作成
          </ChakraLink>
        </Flex>
      </Flex>

    </Box>
  )
}

export default Header