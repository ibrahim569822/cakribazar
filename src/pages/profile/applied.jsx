import axios from '../../Lib/axios.js'
import React from "react";

const applicationStatuses = {
  1: { label: "Applied", color: "bg-secondary" },
  2: { label: "Viewed", color: "bg-info text-dark" },
  3: { label: "Shortlisted", color: "bg-warning text-dark" },
  4: { label: "Interviewed", color: "bg-primary" },
  5: { label: "Hired", color: "bg-success" },
  6: { label: "Rejected", color: "bg-danger" },
};

const sortApplicationsById = (applications) =>
  [...applications].sort((first, second) => Number(first.id) - Number(second.id));

function AppliedJobs() {
  const [applications, setApplications] = React.useState([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const applyStatusSnapshot = (snapshot) => {
      setApplications((currentApplications) =>
        currentApplications.map((application) => {
          const statusUpdate = snapshot.find((item) => item.id === Number(application.id));
          return statusUpdate ? { ...application, status: statusUpdate.status } : application;
        })
      );
    };

    const connectToStatusStream = async () => {
      while (isActive) {
        try {
          const token = localStorage.getItem("access_token");
          const response = await fetch(
            axios.getUri({ url: '/applications/single.php?stream=1' }),
            {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            }
          );
          if (!response.ok || !response.body) {
            throw new Error(`Status stream failed with HTTP ${response.status}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (isActive) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
            let frameEnd = buffer.indexOf("\n\n");
            while (frameEnd !== -1) {
              const frame = buffer.slice(0, frameEnd);
              buffer = buffer.slice(frameEnd + 2);
              const dataLine = frame.split("\n").find((line) => line.startsWith("data: "));
              if (dataLine) {
                const payload = JSON.parse(dataLine.slice(6));
                applyStatusSnapshot(payload.data || []);
              }
              frameEnd = buffer.indexOf("\n\n");
            }
          }
        } catch (error) {
          if (isActive && error.name !== "AbortError") {
            console.error("Error receiving application status updates:", error);
          }
        }

        if (isActive) {
          await new Promise((resolve) => {
            const abortHandler = () => {
              clearTimeout(timeoutId);
              resolve();
            };
            const timeoutId = setTimeout(() => {
              controller.signal.removeEventListener("abort", abortHandler);
              resolve();
            }, 1000);
            controller.signal.addEventListener("abort", abortHandler, { once: true });
          });
        }
      }
    };

    const loadApplications = async () => {
      try {
        const res = await axios.get('/applications/single.php');
        setApplications(sortApplicationsById(res.data.data || []));
        connectToStatusStream();
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    loadApplications();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-round">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <h4 className="card-title">Applications</h4>

                {/* <Link
                  to="/applications/create"
                  className="btn btn-primary btn-round ms-auto"
                >
                  <i className="fa fa-plus"></i>
                  &nbsp; Add Application
                </Link> */}
              </div>
            </div>

            <div className="card-body">
              {/* Search */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="input-icon">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search job title..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <span className="input-icon-addon">
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Application Id</th>
                      <th>Job Title</th>
                      <th>Seeker Name</th>
                      <th>Seeker Email</th>
                      <th>Resume</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application, index) => (
                      <tr key={application.id}>
                        <td>{index + 1}</td>
                        <td>{application.id}</td>
                        <td>{application.job_title || "N/A"}</td>
                        <td>{application.seeker_name || "N/A"}</td>
                        <td>{application.seeker_email || "N/A"}</td>
                        <td>
                          <a href={`${import.meta.env.VITE_API_URL}/${application.resume}`} target="_blank" rel="noopener noreferrer">
                            View Resume
                          </a>
                        </td>
                        <td>
                          <p
                            aria-label={`Application status: ${applicationStatuses[application.status]?.label || "Unknown"}`}
                            className={`badge mb-0 ${applicationStatuses[application.status]?.color || "bg-secondary"}`}
                          >
                            {applicationStatuses[application.status]?.label || "Unknown"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppliedJobs;
