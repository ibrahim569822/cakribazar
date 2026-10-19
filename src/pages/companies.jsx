import React from 'react';
import axios from '../Lib/axios.js';
function Companies() {

    const [companies, setCompanies] = React.useState([]);

  function fetchCompanies() {
  axios.get('http://localhost/cakribazar/companies/index.php')
    .then(response => setCompanies(response.data.data))
    .catch(error => console.error('Error fetching companies:', error));
}

React.useEffect(() => {
  fetchCompanies();
}, []);

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">Explore By Company</h1>
                <div className="row g-4">
                    {companies.map(company => (
                    <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                        <a className="cat-item rounded p-4" href="">
                            <p><img src={`${import.meta.env.VITE_API_URL}${company.logo}`} alt={company.name} width="30" /></p>
                            <h6 className="mb-3">{company.name}</h6>
                            <p className="mb-0">{company.description.length > 100 ? company.description.slice(0, 100) + '...' : company.description}</p>
                        </a>
                    </div>
                    ))}
                    
                </div>
            </div>
        </div>
    );
}

export default Companies;