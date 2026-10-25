import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from '../Lib/axios.js';
import './resume.css';

function Resume() {
    const [userData] = useState(() => JSON.parse(localStorage.getItem('userdata') || 'null'));
    const [profile, setProfile] = useState({});
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(() => Boolean(userData?.id));
    const [error, setError] = useState(() => userData?.id ? '' : 'Please sign in again to view your resume.');

    useEffect(() => {
        let active = true;

        const loadResume = async () => {
            try {
                const [profileResponse, educationResponse, experienceResponse] = await Promise.all([
                    axios.get(`profile/single.php?id=${userData.id}`),
                    axios.get('/profile/history.php', { params: { type: 'education' } }),
                    axios.get('/profile/history.php', { params: { type: 'experience' } }),
                ]);

                if (active) {
                    setProfile(profileResponse.data[0]?.data?.[0] || {});
                    setEducation(educationResponse.data.data || []);
                    setExperience(experienceResponse.data.data || []);
                }
            } catch (requestError) {
                if (active) {
                    setError(requestError.response?.data?.message || 'Unable to load your resume. Please try again.');
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        if (userData?.id) loadResume();

        return () => {
            active = false;
        };
    }, [userData?.id]);

    const fullName = userData?.name || 'Your Name';
    const genderLabels = { 1: 'Male', 2: 'Female', 3: 'Other' };

    return (
        <main className="resume-page container py-5">
            <div className="resume-actions d-flex justify-content-between align-items-center mb-4">
                <Link to="/profile" className="btn btn-outline-secondary">Back to profile</Link>
                <button type="button" className="btn btn-primary" onClick={() => window.print()} disabled={loading || Boolean(error)}>
                    <i className="bi bi-printer me-2" aria-hidden="true" />
                    Print / Save as PDF
                </button>
            </div>

            {loading && <div className="alert alert-info" role="status">Preparing your resume...</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            {!loading && !error && (
                <article className="resume-document" id="resume-document">
                    <header className="resume-header">
                        {profile.image && (
                            <img
                                className="resume-photo"
                                src={`${import.meta.env.VITE_API_URL}/${profile.image}`}
                                alt={`${fullName} profile`}
                            />
                        )}
                        <div>
                            <h1>{fullName}</h1>
                            {profile.job_title && <p className="resume-job-title">{profile.job_title}</p>}
                            <div className="resume-contact">
                                {userData?.email && <p><i className="bi bi-envelope" aria-hidden="true" /> {userData.email}</p>}
                                {userData?.contact && <p><i className="bi bi-telephone" aria-hidden="true" /> {userData.contact}</p>}
                                {(profile.address || profile.country) && (
                                    <p>
                                        <i className="bi bi-geo-alt" aria-hidden="true" /> {[profile.address, profile.country].filter(Boolean).join(', ')}
                                    </p>
                                )}
                            </div>
                            {(profile.linkedin || profile.twitter) && (
                                <div className="resume-links">
                                    {profile.linkedin && <a href={profile.linkedin}>{profile.linkedin}</a>}
                                    {profile.twitter && <a href={profile.twitter}>{profile.twitter}</a>}
                                </div>
                            )}
                        </div>
                    </header>

                    {profile.summary && (
                        <section className="resume-section">
                            <h2>Professional Summary</h2>
                            <p className="resume-summary">{profile.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="resume-section">
                            <h2>Work Experience</h2>
                            {experience.map((item) => (
                                <div className="resume-entry" key={item.id}>
                                    <div className="resume-entry-heading">
                                        <h3>{item.position}</h3>
                                        <span>
                                            {item.start_date} – {Number(item.is_current) ? 'Present' : item.end_date || ''}
                                        </span>
                                    </div>
                                    <p className="resume-entry-subtitle">{item.company_name}</p>
                                    {item.description && <p className="resume-entry-description">{item.description}</p>}
                                </div>
                            ))}
                        </section>
                    )}

                    {education.length > 0 && (
                        <section className="resume-section">
                            <h2>Education</h2>
                            {education.map((item) => (
                                <div className="resume-entry" key={item.id}>
                                    <div className="resume-entry-heading">
                                        <h3>{item.degree}</h3>
                                        {item.passing_year && <span>{item.passing_year}</span>}
                                    </div>
                                    <p className="resume-entry-subtitle">{item.institution}</p>
                                    {(item.field || item.result) && (
                                        <p className="resume-entry-description">
                                            {[item.field, item.result && `Result: ${item.result}`].filter(Boolean).join(' · ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {(profile.date_of_birth || profile.gender || profile.country) && (
                        <section className="resume-section">
                            <h2>Personal Details</h2>
                            <div className="resume-personal-details">
                                {profile.date_of_birth && <p><strong>Date of birth:</strong> {profile.date_of_birth}</p>}
                                {profile.gender && <p><strong>Gender:</strong> {genderLabels[profile.gender] || 'Not specified'}</p>}
                                {profile.country && <p><strong>Country:</strong> {profile.country}</p>}
                            </div>
                        </section>
                    )}
                </article>
            )}
        </main>
    );
}

export default Resume;
