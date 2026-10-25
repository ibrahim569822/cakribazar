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
import Companies from './pages/companies.jsx'
import JobDetails from './pages/job-details.jsx'
import LogIn from './pages/login.jsx'
import Register from './pages/register.jsx'
import Protected from './Auth/protected.jsx'
import Profile from './pages/profile.jsx'
import Resume from './pages/resume.jsx'
import Logout from './Auth/logout.jsx'
import { useState } from 'react'  

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
  companies: [
    { image: '/img/carousel-1.jpg', title: 'Companies', text: '' },
  ],
  JobDetails: [
    { image: '/img/carousel-1.jpg', title: 'Job Details', text: '' },
  ],
}

function Layout() {
  const { pathname } = useLocation()
  const [ isSignedIn, setIsSignedIn ] = useState(()=> {
    /* if you want, user will be logged in until they logout*/
    return localStorage.getItem("access_token") == 'undefined' || localStorage.getItem("access_token") == null ? false : true;
    /* if you want, user will be logged when they close the browser*/
    //return sessionStorage.getItem("access_token") || false;
  });

  const pageKey =
    pathname === '/category' ? 'category'
    : pathname === '/job-list' ? 'jobList'
    : pathname === '/about' ? 'about'
    : pathname === '/companies' ? 'companies'
    : pathname.startsWith('/job-details/') ? 'JobDetails'
    : pathname === '/' ? 'home'
    : pathname === '/login' ? 'home'
    : pathname === '/register' ? 'home'
    : pathname === '/profile' ? 'home'
    : pathname === '/resume' ? 'home'
    : 'errorPage'
  const showCarousel = pathname !== '/profile' && pathname !== '/resume'

  return (
    <div className="container-xxl bg-light p-0">
      <Nav />
      {showCarousel && <Carousel slides={pageSlides[pageKey]} />}
      <Routes>
        <Route path='/login' element={<LogIn />} />
        <Route path='/register' element={<Register />} />
        <Route element={<Protected isSignedIn={isSignedIn} />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/resume' element={<Resume />} />
          <Route path='/category' element={<Category />} />
          <Route path='/job-list' element={<JobList />} />
          <Route path='/about' element={<About />} />
          <Route path='/companies' element={<Companies />} />
          <Route path='/job-details/:id' element={<JobDetails />} />
          <Route path='*' element={<ErrorPage />} />
        </Route>
        <Route path='/logout' element={<Logout />} />
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