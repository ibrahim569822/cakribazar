import React from 'react';
import axios from '../Lib/axios.js';
import { Link, useParams } from 'react-router';

function JobDetails() {
    let {id} = useParams();
    const [job, setJob] = React.useState({});
    const [company, setCompany] = React.useState({});
    const userData = JSON.parse(localStorage.getItem('userdata'));

    const fetchJob = async () => {
        let res = await axios.get('jobs/single.php?id=' + id);
        setJob(res?.data?.data[0]);
    };
    const fetchCompany = async () => {
        let res = await axios.get('companies/single.php?id=' + job.company_id);
        setCompany(res?.data?.data[0]);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('job_id', id);
        formData.append('seeker_id', userData.id);
        try {
            let res = await axios.post('applications/create.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res);
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    };

    React.useEffect(() => {
        fetchJob();
        if (job.company_id) {
            fetchCompany();
        }
    }, [job.company_id]);
    return (
        <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="container">
                <div className="row gy-5 gx-4">
                    <div className="col-lg-8">
                        <div className="d-flex align-items-center mb-5">
                            <img className="flex-shrink-0 img-fluid border rounded" src={`${import.meta.env.VITE_API_URL}${job.icon}`} alt="" style={{ width: '80px', height: '80px' }} />
                            <div className="text-start ps-4">
                                <h3 className="mb-3">{job.title}</h3>
                                <span className="text-truncate me-3"><i className="fa fa-map-marker-alt text-primary me-2"></i>{job.location}</span>
                                <span className="text-truncate me-3"><i className="far fa-clock text-primary me-2"></i>
                                {job.job_type==1 ? 'Full Time' : job.job_type==2 ? 'Part Time' : job.job_type==3 ? 'Contract' : job.job_type==4 ? 'Freelance' : 'Internship'}
                                </span>
                                <span className="text-truncate me-0"><i className="far fa-money-bill-alt text-primary me-2"></i>{job.salary_min} - {job.salary_max}</span>
                            </div>
                        </div>

                        <div className="mb-5">
                            <h4 className="mb-3 description">Job Description</h4>
                            <p>{job.description}</p>
                            <h4 className="mb-3 description">Requirements</h4>
                            <p>{job.requirements}</p>
                        </div>
        
                        <div className="">
                            <h4 className="mb-4">Apply For The Job</h4>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row g-3">
                                    <div className="col-12 col-sm-6">
                                        <input type="text" className="form-control" value={userData?.name || ''} readOnly />
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <input type="email" className="form-control" placeholder="Your Email" value={userData.email || ''} readOnly />
                                    </div>
                                    <div className="col-12">
                                        <input type="file" className="form-control bg-white" name="resume" />
                                    </div>
                                    <div className="col-12">
                                        <textarea name="cover_letter" className="form-control" rows="5" placeholder="Coverletter"></textarea>
                                    </div>
                                    <div className="col-12">
                                        
                                        <button className="btn btn-primary w-100" type="submit">Apply Now</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
        
                    <div className="col-lg-4">
                        <div className="bg-light rounded p-5 mb-4 wow slideInUp" data-wow-delay="0.1s">
                            <h4 className="mb-4">Job Summery</h4>
                            <p><i className="fa fa-angle-right text-primary me-2"></i>Published On: {job.created_at}</p>
                            <p><i className="fa fa-angle-right text-primary me-2"></i>Vacancy: {job.vacancies} Position</p>
                            <p><i className="fa fa-angle-right text-primary me-2"></i>Job Nature: {job.job_type==1 ? 'Full Time' : job.job_type==2 ? 'Part Time' : job.job_type==3 ? 'Contract' : job.job_type==4 ? 'Freelance' : 'Internship'}</p>
                            <p><i className="fa fa-angle-right text-primary me-2"></i>Salary: ${job.salary_min} - ${job.salary_max}</p>
                            <p><i className="fa fa-angle-right text-primary me-2"></i>Location: {job.location}</p>
                            <p className="m-0"><i className="fa fa-angle-right text-primary me-2"></i>Deadline: {job.deadline}</p>
                        </div>
                        <div className="bg-light rounded p-5 wow slideInUp" data-wow-delay="0.1s">
                            <h4 className="mb-4">Company Detail</h4>
                            <p className="m-0">{company.description && company.description.slice(0, 100)}...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;