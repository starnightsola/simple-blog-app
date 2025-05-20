import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PostDetailPage from './pages/PostDetailPage'

function App() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container as="main" maxW="1200px" flex="1" py={8}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
        </Routes>
      </Container>
      <Footer />
    </Box>
  )
}

export default App
