import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import Home from './pages/home.jsx'
import Category from './pages/category.jsx'
import Nav from './components/nav.jsx'
import Footer from './components/footer.jsx'
import BackToTop from './components/back-to-top.jsx'
import ErrorPage from './pages/error-page.jsx'
import JobList from './pages/job-list.jsx'
import Carousel from './components/carousel.jsx'
import About from './pages/about.jsx'

const pageSlides = {
  home: [
    { image: '/img/carousel-1.jpg', title: 'Find The Perfect Job That You Deserved', text: '' },
  ],
  category: [
    { image: '/img/carousel-1.jpg', title: 'Browse Job Categories', text: '' },
  ],
  jobList: [
    { image: '/img/carousel-1.jpg', title: 'Job Listings', text: '' },
  ],
  errorPage: [
    { image: '/img/carousel-1.jpg', title: 'Error 404', text: '' },
  ],
  about: [
    { image: '/img/carousel-1.jpg', title: 'About Us', text: '' },
  ],
}

function Layout() {
  const { pathname } = useLocation()

  const pageKey =
    pathname === '/category' ? 'category'
    : pathname === '/job-list' ? 'jobList'
    : pathname === '/about' ? 'about'
    : pathname === '/' ? 'home'
    : 'errorPage'

  return (
    <div className="container-xxl bg-light p-0">
      <Nav />
      <Carousel slides={pageSlides[pageKey]} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/category' element={<Category />} />
        <Route path='/job-list' element={<JobList />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
      <Footer />
      <BackToTop />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App