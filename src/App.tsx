import './App.css'

import { AnimatePresence } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Box, useDisclosure } from '@chakra-ui/react' //
import Header from './components/Header'
import Footer from './components/Footer'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import PostDetailPage from './pages/PostDetailPage'
import NewPostPage from './pages/NewPostPage'
import EditPostPage from './pages/EditPostPage'

function App() {
  const location = useLocation() // 追加！
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header onOpen={onOpen} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            element={<Layout isOpen={isOpen} onClose={onClose} />}
          >
            <Route index element={<HomePage />} />
            <Route path="posts/:postId" element={<PostDetailPage />} />
            <Route path="posts/new" element={<NewPostPage />} />
            <Route path="posts/:id/edit" element={<EditPostPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Footer />
    </Box>
  )
}

export default App
