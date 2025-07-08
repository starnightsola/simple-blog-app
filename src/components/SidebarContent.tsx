import { Box, VStack, Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

type Props = {
  onClose?: () => void;
};

const SidebarContent = ({ onClose }: Props) => {
  return (
    <Box p={{ base: 9, md: 6 }}>
      <VStack align="start" spacing={4}>
        <ChakraLink as={RouterLink} to="/" fontWeight="bold" display="block" width="100%" _hover={{ textDecoration: 'none', color: 'gray.600', }} onClick={onClose}>
          Home
        </ChakraLink>
        <ChakraLink as={RouterLink} to="/posts/new" fontWeight="bold" data-testid="create-link" _hover={{ textDecoration: 'none', color: 'gray.600', }} display="block" width="100%" onClick={onClose}>
          ＋ 記事作成
        </ChakraLink>
        {/* 今後アーカイブやプロフィールを追加 */}
      </VStack>
    </Box>
  );
};

export default SidebarContent;
