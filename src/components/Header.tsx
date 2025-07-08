import { Box, Heading, Link as ChakraLink, Flex, IconButton ,Show } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'
type Props = {
  onOpen: () => void
}
const Header = ({ onOpen }: Props) => {
  return (
    <>
      <Box as="header" bg="primary.100" py={4} pl={{ base: 3, md: 6 }} pr={6}>
        <Flex justify="space-between" align="center">
          {/* 左側：メニューボタン + ロゴ */}
            <Flex align="center" gap={2}>
              {/* モバイル表示時のみメニューボタン表示 */}
              <Show below="md">
                <IconButton
                  icon={<HamburgerIcon />}
                  aria-label="メニュー"
                  onClick={onOpen}
                  variant="ghost"
                  color="white"
                />
              </Show>
              <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                <Heading
                  size="lg"
                  fontFamily="'Playwrite DK Loopet', cursive"
                  color="white"
                >
                  Blog
                </Heading>
              </ChakraLink>
            </Flex>
          {/* 右側：ナビゲーションリンク */}
          <Flex gap={4}>
            <ChakraLink as={RouterLink} to="/" fontWeight="bold" color="white">
              Home
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/posts/new" fontWeight="bold" color="white" data-testid="create-link">
              ＋ 記事作成
            </ChakraLink>
          </Flex>
        </Flex>

      </Box>
    </>
  )
}

export default Header