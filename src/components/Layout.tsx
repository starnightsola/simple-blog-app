import {
  Drawer, DrawerOverlay, DrawerContent, Flex, Box, DrawerCloseButton
} from '@chakra-ui/react'
import { Outlet } from "react-router-dom";
import SidebarContent from './SidebarContent';

type Props = {
  isOpen: boolean // ドロワーを開くかどうかの状態（true: 開く）
  onClose: () => void // ドロワーを閉じる関数（×ボタンや外部クリックで呼ばれる）
}

const Layout = ({ isOpen, onClose }: Props) => {
  return (
    <>
      <Flex>
        {/* ✅ PC表示時のサイドバー */}
        <Box
          display={{ base: "none", md: "block" }}
          w="250px"
          minH="100vh"
          bg="#F8F9D7"
          px={4}
          py={6}
        >
          <SidebarContent />
        </Box>

        {/* ✅ メインコンテンツ（共通） */}
        <Box flex="1" px={10} py={8} minH="100vh">
          <Outlet />
        </Box>
      </Flex>
      {/* モバイル用 Drawer サイドバー */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <SidebarContent onClose={onClose} /> {/* 閉じるボタン付 */}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Layout;
