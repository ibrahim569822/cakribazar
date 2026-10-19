import Search from './search.jsx'
import Category from './category.jsx'
import JobList from './job-list.jsx';
import Companies from './companies.jsx';


function Home() {
    return (
        <>
    <div className="container-xxl bg-light p-0">
      <Search />
      <Category />
      <Companies />
      <JobList />
    </div>
    </>
    );
}
export default Home;