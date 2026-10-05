import './App.css'
import Home from './pages/home.jsx'
import Category from './pages/category.jsx'
import Nav from './components/nav.jsx'
import Footer from './components/footer.jsx'
import BackToTop from './components/back-to-top.jsx'
import ErrorPage from './pages/error-page.jsx'
import JobList from './pages/job-list.jsx'
import Carousel from './components/carousel.jsx'

function App() {
   const currentPath = window.location.pathname.replace(/\/$/, '') || '/'
   const page = 
                currentPath === '/' || currentPath === '/index' || currentPath === '/home'
                  ? <Home />
                  : currentPath === '/category'
                    ? <Category />
                    : currentPath === '/error-page'
                    ? <ErrorPage />
                    : currentPath === '/job-list'
                    ? <JobList />
                        : null; // Default to Home if no match


       const pageSlides = {
                              home: [
                                  { image: '/img/carousel-1.jpg', title: 'Find The Perfect Job That You Deserved', text: 'Home caption one' },
                                  { image: '/img/carousel-2.jpg', title: 'Find The Best Startup Job That Fit You', text: 'Home caption two' },
                              ],
                              category: [
                                  { image: '/img/carousel-1.jpg', title: 'Browse Job Categories', text: 'Category caption one' },
                                  { image: '/img/carousel-2.jpg', title: 'Explore Jobs By Industry', text: 'Category caption two' },
                              ],
                          }

        const pageKey = currentPath === '/category' ? 'category' : 'home'
        const slides = pageSlides[pageKey]


  return (
    <>
    <div className="container-xxl bg-light p-0">
      <Nav />
      <Carousel slides={slides}/>
      {page}
      <Footer />
      <BackToTop />
    </div>
    </>
  )
}

export default App
