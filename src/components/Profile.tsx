// components/Profile.tsx
import { Box, Avatar, Text, Link, HStack, Icon } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'

const Profile = () => {
  return (
    <Box textAlign="center">
        <Avatar size="xl" name="Kou BiShin" src="" mb={4} />
        <Text fontWeight="bold" fontSize="lg">Kou BiShin</Text>
        <Text fontSize="sm" color="gray.600">フロントエンドエンジニア</Text>

        <HStack justify="center" spacing={4} mt={3}>
            <Link href="https://github.com/starnightsola" isExternal>
                <Icon as={FaGithub} boxSize={5} />
            </Link>
        </HStack>
    </Box>
  )
}

export default Profile
