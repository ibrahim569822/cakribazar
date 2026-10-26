import {useState, useEffect} from 'react';
import { Link } from 'react-router';
import axios from '../Lib/axios.js';
import AppliedJobs from './profile/applied.jsx';

const historyFields = {
    education: [
        { name: 'degree', label: 'Degree', required: true },
        { name: 'institution', label: 'Institution', required: true },
        { name: 'field', label: 'Field of study' },
        { name: 'passing_year', label: 'Passing year', type: 'number', min: 1901, max: 2155 },
        { name: 'result', label: 'Result' },
    ],
    experience: [
        { name: 'position', label: 'Position', required: true },
        { name: 'company_name', label: 'Company', required: true },
        { name: 'start_date', label: 'Start date', type: 'date', required: true },
        { name: 'end_date', label: 'End date', type: 'date' },
        { name: 'is_current', label: 'I currently work here', type: 'checkbox' },
        { name: 'description', label: 'Description', type: 'textarea', help: 'Write each responsibility or achievement on a new line.' },
    ],
};

function HistorySection({ type }) {
    const fields = historyFields[type];
    const title = type === 'education' ? 'Education' : 'Experience';
    const [items, setItems] = useState([]);
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        axios.get('/profile/history.php', { params: { type } })
            .then((response) => {
                if (active) setItems(response.data.data || []);
            })
            .catch((requestError) => {
                if (active) setError(requestError.response?.data?.message || `Unable to load ${title.toLowerCase()}.`);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [type, title]);

    const startNew = () => {
        setError('');
        setDraft(Object.fromEntries(fields.map((field) => [field.name, field.type === 'checkbox' ? false : ''])));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        const formData = new FormData(event.currentTarget);
        if (type === 'experience' && draft.is_current) {
            formData.set('is_current', '1');
            formData.set('end_date', '');
        }

        try {
            const url = `/profile/history.php?type=${type}${draft.id ? `&id=${draft.id}` : ''}`;
            const response = await axios.post(url, formData);
            const savedItem = response.data.data;
            setItems((currentItems) => draft.id
                ? currentItems.map((item) => String(item.id) === String(savedItem.id) ? savedItem : item)
                : [savedItem, ...currentItems]);
            setDraft(null);
        } catch (requestError) {
            setError(requestError.response?.data?.message || `Unable to save ${title.toLowerCase()}.`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete this ${type} record?`)) return;
        setError('');
        try {
            await axios.delete('/profile/history.php', { params: { type, id: item.id } });
            setItems((currentItems) => currentItems.filter((currentItem) => String(currentItem.id) !== String(item.id)));
            if (String(draft?.id) === String(item.id)) setDraft(null);
        } catch (requestError) {
            setError(requestError.response?.data?.message || `Unable to delete ${title.toLowerCase()}.`);
        }
    };

    const updateDraft = (name, value) => {
        setDraft((currentDraft) => ({
            ...currentDraft,
            [name]: value,
            ...(name === 'is_current' && value ? { end_date: '' } : {}),
        }));
    };

    return (
        <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">{title}</h5>
                {!draft && <button type="button" className="btn btn-primary btn-sm" onClick={startNew}>Add {title}</button>}
            </div>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {loading && <p>Loading {title.toLowerCase()}...</p>}

            {!loading && items.length === 0 && !draft && (
                <p className="text-muted">No {title.toLowerCase()} added yet.</p>
            )}

            {items.map((item) => (
                <div className="border rounded p-3 mb-3" key={item.id}>
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 className="mb-1">{type === 'education' ? item.degree : item.position}</h6>
                            <p className="mb-1">{type === 'education' ? item.institution : item.company_name}</p>
                            {type === 'education' ? (
                                <small className="text-muted">
                                    {[item.field, item.passing_year && `Class of ${item.passing_year}`, item.result && `Result: ${item.result}`]
                                        .filter(Boolean).join(' · ')}
                                </small>
                            ) : (
                                <>
                                    <small className="text-muted">
                                        {item.start_date} – {Number(item.is_current) ? 'Present' : item.end_date || 'Not specified'}
                                    </small>
                                    {item.description && <p className="mb-0 mt-2" style={{ whiteSpace: 'pre-line' }}>{item.description}</p>}
                                </>
                            )}
                        </div>
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setDraft({ ...item })}>Edit</button>
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(item)}>Delete</button>
                        </div>
                    </div>
                </div>
            ))}

            {draft && (
                <form onSubmit={handleSubmit} className="border rounded p-3">
                    <h6 className="mb-3">{draft.id ? `Edit ${title}` : `Add ${title}`}</h6>
                    {fields.map((field) => (
                        field.type === 'checkbox' ? (
                            <div className="form-check mb-3" key={field.name}>
                                <input
                                    className="form-check-input"
                                    id={`${type}-${field.name}`}
                                    name={field.name}
                                    type="checkbox"
                                    checked={Number(draft[field.name]) === 1}
                                    onChange={(event) => updateDraft(field.name, event.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`${type}-${field.name}`}>{field.label}</label>
                            </div>
                        ) : (
                            <div className="mb-3" key={field.name}>
                                <label className="form-label" htmlFor={`${type}-${field.name}`}>{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <>
                                        <textarea
                                            className="form-control"
                                            id={`${type}-${field.name}`}
                                            name={field.name}
                                            rows="3"
                                            value={draft[field.name] || ''}
                                            onChange={(event) => updateDraft(field.name, event.target.value)}
                                        />
                                        {field.help && <small className="form-text text-muted">{field.help}</small>}
                                    </>
                                ) : (
                                    <input
                                        className="form-control"
                                        id={`${type}-${field.name}`}
                                        name={field.name}
                                        type={field.type || 'text'}
                                        min={field.min}
                                        max={field.max}
                                        required={field.required}
                                        disabled={field.name === 'end_date' && draft.is_current}
                                        value={draft[field.name] || ''}
                                        onChange={(event) => updateDraft(field.name, event.target.value)}
                                    />
                                )}
                            </div>
                        )
                    ))}
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setDraft(null)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}

function SkillsSection() {
    const [skills, setSkills] = useState([]);
    const [skillName, setSkillName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        axios.get('/profile/skills.php')
            .then((response) => {
                if (active) setSkills(response.data.data || []);
            })
            .catch((requestError) => {
                if (active) setError(requestError.response?.data?.message || 'Unable to load skills.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const addSkill = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        try {
            const formData = new FormData();
            formData.set('name', skillName);
            const response = await axios.post('/profile/skills.php', formData);
            const savedSkill = response.data.data;
            setSkills((currentSkills) => currentSkills.some((skill) => String(skill.id) === String(savedSkill.id))
                ? currentSkills
                : [...currentSkills, savedSkill]);
            setSkillName('');
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to add skill.');
        } finally {
            setSaving(false);
        }
    };

    const removeSkill = async (skill) => {
        setError('');
        try {
            await axios.delete('/profile/skills.php', { params: { id: skill.id } });
            setSkills((currentSkills) => currentSkills.filter((currentSkill) => String(currentSkill.id) !== String(skill.id)));
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to remove skill.');
        }
    };

    return (
        <div className="tab-pane fade show active">
            <h5 className="card-title">Skills</h5>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {loading ? <p>Loading skills...</p> : (
                <>
                    {skills.length === 0
                        ? <p className="text-muted">No skills added yet.</p>
                        : (
                            <ul className="list-group mb-3">
                                {skills.map((skill) => (
                                    <li className="list-group-item d-flex justify-content-between align-items-center" key={skill.id}>
                                        {skill.name}
                                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeSkill(skill)}>
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    <form onSubmit={addSkill} className="d-flex gap-2">
                        <input
                            className="form-control"
                            type="text"
                            aria-label="Skill name"
                            maxLength="60"
                            placeholder="e.g. Communication"
                            value={skillName}
                            onChange={(event) => setSkillName(event.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary text-nowrap" disabled={saving}>
                            {saving ? 'Adding...' : 'Add Skill'}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

function Profile() {
   const [activeTab, setActiveTab] = useState('overview');
   const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem("userdata")));

   const [profileData, setProfileData] = useState({});
   const [saveError, setSaveError] = useState('');
    useEffect(() => {
        let active = true;
        const loadProfileData = async () => {
            try {
                const response = await axios.get(`profile/single.php?id=${userData.id}`);
                if (active) setProfileData(response.data[0].data[0] || {});
            } catch (error) {
                if (active) console.error('Error fetching profile data:', error);
            }
        };

        loadProfileData();
        return () => {
            active = false;
        };
    }, [userData.id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setSaveError('');
    try {
    const response = await axios.post('profile/save.php', formData, {
        headers: {
                    'Content-Type': 'multipart/form-data'
        }
    });
    const updatedUser = { ...userData, ...response.data.user };
    localStorage.setItem('userdata', JSON.stringify(updatedUser));
    setUserData(updatedUser);
    setProfileData(response.data.profile || {});
    
    }
   catch (error) {
            console.error('Error updating profile:', error);
            setSaveError(error.response?.data?.message || 'Unable to save profile changes.');
        }
    };
    
    return (
        <>
            <section className="section profile">
                <div className="row">
                    <div className="col-xl-4">

                    <div className="card">
                        <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">

                            <img src={profileData?.image ? `${import.meta.env.VITE_API_URL}/${profileData.image}` : '/img/profile-img.jpg'} alt="Edit Profile" className="rounded-circle" />
                            <h1>{userData.name || 'Kevin Anderson'}</h1>
                            <p className="small fst-italic">{profileData?.job_title || 'Edit Profile'}</p>
                            <p><span><i className="bi bi-envelope"></i></span> {userData.email || 'Not Found'}</p>
                            <p><span><i className="bi bi-telephone"></i></span> {userData.contact || 'Not Found'}</p>
                            <div className="social-links mt-2 mb-4">
                                <a href={profileData?.twitter || '#'} className="twitter"><i className="bi bi-twitter"></i></a>
                                <a href={profileData?.linkedin || '#'} className="linkedin"><i className="bi bi-linkedin"></i></a>
                            </div>

                            <Link to="/resume" className="btn btn-outline-primary btn-sm">Preview Resume</Link>
                            
                            <div className="social-links mt-5">
                                <Link className="dropdown-item d-flex align-items-center" to="/logout">
                                <i className="bi bi-box-arrow-right"></i>
                                <span className="ms-2">Sign Out</span>
                                </Link>
                            </div>
                             
                        </div>
                        
                    </div>

                    </div>

                    <div className="col-xl-8">

                    <div className="card">
                        <div className="card-body pt-3">
                        <ul className="nav nav-tabs nav-tabs-bordered">

                            
                               
                           
                            <li className="nav-item">
                            <button className={activeTab === 'overview' ? 'nav-link active' : 'nav-link'} data-bs-toggle="tab" data-bs-target="#profile-overview" onClick={() => setActiveTab('overview')}>Overview</button>
                            </li>

                            <li className="nav-item">
                            <button className={activeTab === 'edit' ? 'nav-link active' : 'nav-link'} data-bs-toggle="tab" data-bs-target="#profile-edit" onClick={() => setActiveTab('edit')}>Edit Profile</button>
                            </li>

                            <li className="nav-item">
                            <button className={activeTab === 'education' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('education')}>Education</button>
                            </li>
                            <li className="nav-item">
                            <button className={activeTab === 'experience' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('experience')}>Experience</button>
                            </li>
                            <li className="nav-item">
                            <button className={activeTab === 'skills' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('skills')}>Skills</button>
                            </li>
                            <li className="nav-item">
                            <button className={activeTab === 'applied' ? 'nav-link active' : 'nav-link'} data-bs-toggle="tab" data-bs-target="#profile-applied" onClick={() => setActiveTab('applied')}>Applied Jobs</button>
                            </li>

                        </ul>
                        <div className="tab-content pt-2">
                            {activeTab === 'overview' && (
                            <div className="tab-pane fade show active profile-overview" id="profile-overview">
                            
                                <h5 className="card-title">Profile Details</h5>
                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label ">User Id</div>
                                    <div className="col-lg-9 col-md-8">{userData.id || 'Null'}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                    <div className="col-lg-9 col-md-8">{userData.name || 'Kevin Anderson'}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Username</div>
                                    <div className="col-lg-9 col-md-8">{userData.username || 'Not set'}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Summary</div>
                                    <div className="col-lg-9 col-md-8">{profileData?.summary || 'Edit Profile'}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Job</div>
                                    <div className="col-lg-9 col-md-8">{profileData?.job_title || 'Edit Profile'}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Date of Birth</div>
                                    <div className="col-lg-9 col-md-8">{profileData?.date_of_birth || 'Edit Profile'}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Gender</div>
                                    <div className="col-lg-9 col-md-8">
                                        {{ 1: 'Male', 2: 'Female', 3: 'Other' }[profileData?.gender] || 'Edit Profile'}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Country</div>
                                    <div className="col-lg-9 col-md-8">{profileData?.country || 'Edit Profile'}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Address</div>
                                    <div className="col-lg-9 col-md-8">{profileData?.address || 'Edit Profile'}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Phone</div>
                                    <div className="col-lg-9 col-md-8">{userData.contact || 'Not Found'}</div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-3 col-md-4 label">Email</div>
                                    <div className="col-lg-9 col-md-8">{userData.email || 'Not Found'}</div>
                                </div>

                            </div>
                            )}
                            {activeTab === 'edit' && (
                            <div className="tab-pane fade show active" id="profile-edit">

                                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                    <label htmlFor="profileImage" className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                                    <div className="col-md-8 col-lg-9">
                                        <img src={profileData?.image ? `${import.meta.env.VITE_API_URL}/${profileData.image}` : '/img/profile-img.jpg'} alt="Edit Profile" className="img-thumbnail" height="100" width='100' />
                                        <div className="pt-2">
                                        <input type="file" name="image" className="" id="profileImage" />
                                        <a href="#" className="btn btn-danger btn-sm" title="Remove my profile image"><i className="bi bi-trash"></i></a>
                                        </div>
                                    </div>
                                    </div>

                                    <input type="hidden" name="user_id" value={userData.id} />

                                    <div className="row mb-3">
                                    <label htmlFor="full_name" className="col-md-4 col-lg-3 col-form-label">Full Name</label>
                                    <div className="col-md-8 col-lg-9">
                                        <input required name="name" type="text" className="form-control" id="full_name" defaultValue={userData.name || ''} />
                                    </div>
                                    </div>

                                    <div className="row mb-3">
                                    <label htmlFor="username" className="col-md-4 col-lg-3 col-form-label">Username</label>
                                    <div className="col-md-8 col-lg-9">
                                        <input required name="username" type="text" className="form-control" id="username" defaultValue={userData.username || ''} />
                                    </div>
                                    </div>

                                    <div className="row mb-3">
                                    <label htmlFor="job_title" className="col-md-4 col-lg-3 col-form-label">Job Title</label>
                                    <div className="col-md-8 col-lg-9">
                                        <input name="job_title" type="text" className="form-control" id="job_title" defaultValue={profileData?.job_title || ''} />
                                    </div>
                                    </div>

                                    <div className="row mb-3">
                                    <label htmlFor="date_of_birth" className="col-md-4 col-lg-3 col-form-label">Date of Birth</label>
                                    <div className="col-md-8 col-lg-9">
                                        <input name="date_of_birth" type="date" className="form-control" id="date_of_birth" defaultValue={profileData?.date_of_birth || ''} />
                                    </div>
                                    </div>


                                    <div className="row mb-3">
                                    <label htmlFor="gender" className="col-md-4 col-lg-3 col-form-label">Gender</label>
                                    <div className="col-md-8 col-lg-9">
                                        <select name="gender" className="form-control bg-light" id="gender" defaultValue={profileData?.gender || ''}>
                                            <option value="">Select Gender</option>
                                            <option value="1">Male</option>
                                            <option value="2">Female</option>
                                            <option value="3">Other</option>
                                        </select>
                                    </div>
                                    </div>


                                    <div className="row mb-3">
                                    <label htmlFor="about" className="col-md-4 col-lg-3 col-form-label">Summary</label>
                                    <div className="col-md-8 col-lg-9">
                                        <textarea name="summary" className="form-control" id="about" style={{ height: '100px' }} defaultValue={profileData?.summary || ''}>
                                        
                                        </textarea>
                                    </div>
                                    </div>

                                    <div className="row mb-3">
                                    <label htmlFor="address" className="col-md-4 col-lg-3 col-form-label">Address</label>
                                    <div className="col-md-8 col-lg-9">
                                        <input name="address" type="text" className="form-control" id="address" defaultValue={profileData?.address || ''} />
                                    </div>
                                    </div>

                                    <div className="row mb-3">
                                    <label htmlFor="country" className="col-md-4 col-lg-3 col-form-label">Country</label>
                                    <div className="col-md-8 col-lg-9">
                                        <input name="country" type="text" className="form-control" id="country" defaultValue={profileData?.country || ''} />
                                    </div>
                                    </div>

                                    <div className="row mb-3">
                                    <label htmlFor="Twitter" className="col-md-4 col-lg-3 col-form-label">Twitter Profile</label>
                                    <div className="col-md-8 col-lg-9">
                                        <input name="twitter" type="text" className="form-control" id="Twitter" defaultValue={profileData?.twitter || ''} />
                                    </div>
                                    </div>

                                    <div className="row mb-3">
                                    <label htmlFor="Linkedin" className="col-md-4 col-lg-3 col-form-label">Linkedin Profile</label>
                                    <div className="col-md-8 col-lg-9">
                                        <input name="linkedin" type="text" className="form-control" id="Linkedin" defaultValue={profileData?.linkedin || ''} />
                                    </div>
                                    </div>

                                    <div className="text-center">
                                    {saveError && <div className="alert alert-danger" role="alert">{saveError}</div>}
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                    </div>
                                </form>

                            </div>
                            )}
                            {activeTab === 'education' && <HistorySection type="education" />}
                            {activeTab === 'experience' && <HistorySection type="experience" />}
                            {activeTab === 'skills' && <SkillsSection />}
                            {activeTab === 'applied' && (
                            <div className="tab-pane fade pt-3 show active" id="profile-applied">
                                <AppliedJobs />
                            </div>
                            )}

                        </div>

                        </div>
                    </div>

                    </div>
                </div>
            </section>

         </>
         );
}

export default Profile;