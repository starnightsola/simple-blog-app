import { Box, Text } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box as="footer" bg="primary.100" py={3} px={6} textAlign="center">
      <Text fontSize="sm">© 2025 Blog</Text>
    </Box>
  )
}

export default Footer