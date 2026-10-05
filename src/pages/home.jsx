import Search from './search.jsx'
import Category from './category.jsx'
import JobList from './job-list.jsx';


function Home() {
    return (
        <>
    <div className="container-xxl bg-light p-0">
      <Search />
      <Category />
      <JobList />
    </div>
    </>
    );
}
export default Home;