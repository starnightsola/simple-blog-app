import './App.css'

import { AnimatePresence } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PostDetailPage from './pages/PostDetailPage'
import NewPostPage from './pages/NewPostPage'
import EditPostPage from './pages/EditPostPage'

function App() {
  const location = useLocation() // 追加！
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container as="main" maxW="1200px" flex="1" py={8}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path='/posts/new' element={<NewPostPage />}></Route>
            <Route path='/posts/:id/edit' element={<EditPostPage />}></Route>
          </Routes>
        </AnimatePresence>
      </Container>
      <Footer />
    </Box>
  )
}

export default App
