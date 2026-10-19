
import React from 'react';
import axios from '../Lib/axios.js';
import { Link } from 'react-router';
function JobList() {
    const [jobs, setJobs] = React.useState([]);

  function fetchJobs() {
  axios.get('http://localhost/cakribazar/jobs/index.php')
    .then(response => setJobs(response.data.data))
    .catch(error => console.error('Error fetching jobs:', error));
}

React.useEffect(() => {
  fetchJobs();
}, []);
    return (
        <>
            <div className="container-xxl py-5">
            <div className="container">
                <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">Job Listing</h1>
                <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.3s">
                    <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                        <li className="nav-item">
                            <a className="d-flex align-items-center text-start mx-3 ms-0 pb-3 active" data-bs-toggle="pill" href="#tab-1">
                                <h6 className="mt-n1 mb-0">Featured</h6>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="d-flex align-items-center text-start mx-3 pb-3" data-bs-toggle="pill" href="#tab-2">
                                <h6 className="mt-n1 mb-0">Full Time</h6>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="d-flex align-items-center text-start mx-3 me-0 pb-3" data-bs-toggle="pill" href="#tab-3">
                                <h6 className="mt-n1 mb-0">Part Time</h6>
                            </a>
                        </li>
                    </ul>
                    
                    <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            {jobs.map(job => (
                           <div className="job-item p-4 mb-4">
                                <div className="row g-4">
                                    <div className="col-sm-12 col-md-8 d-flex align-items-center">
                                        <img className="flex-shrink-0 img-fluid border rounded" src={`${import.meta.env.VITE_API_URL}${job.icon}`} alt="" style={{width: '80px', height: '80px'}} />
                                        <div className="text-start ps-4">
                                            <h5 className="mb-3">{job.title}</h5>
                                            <span className="text-truncate me-3"><i className="fa fa-map-marker-alt text-primary me-2"></i>{job.location}</span>
                                            <span className="text-truncate me-3"><i className="far fa-clock text-primary me-2"></i>{job.type}</span>
                                            <span className="text-truncate me-0"><i className="far fa-money-bill-alt text-primary me-2"></i>{job.salary}</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                                        <div className="d-flex mb-3">
                                            <a className="btn btn-light btn-square me-3" href=""><i className="far fa-heart text-primary"></i></a>
                                            <Link className="btn btn-primary" to={`/job-details/${job.id}`}>
                                                Apply Now
                                            </Link>
                                        </div>
                                        <small className="text-truncate"><i className="far fa-calendar-alt text-primary me-2"></i>Deadline: {job.deadline}</small>
                                    </div>
                                </div>
                            </div>
                            ))}
                            <a className="btn btn-primary py-3 px-5" href="">Browse More Jobs</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default JobList;