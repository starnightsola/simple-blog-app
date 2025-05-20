import { Box, Heading, Link as ChakraLink, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const Header = () => {
  return (
    <Box as="header" bg="primary.100" py={4} px={6}>
      <HStack spacing={6}>
        <Heading size="lg" fontFamily="'Playwrite DK Loopet', cursive">Blog</Heading>
        <ChakraLink as={RouterLink} to="/" fontWeight="bold">
          Home
        </ChakraLink>
      </HStack>
    </Box>
  )
}

export default Header