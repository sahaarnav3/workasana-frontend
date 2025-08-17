import axios from "axios";
import { useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function CreateNewProjectModal({ closeModal, token }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  function formHandler(e) {
    e.preventDefault();
    const requestBody = {
      name: projectName,
      description: projectDescription,
    };
    // console.log(requestBody);
    axios
      .post(`${apiBaseUrl}/projects`, requestBody, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status == 200) {
          setSuccess("Project Added successfully.");
          setError("");
        } else {
          setSuccess("");
          setError(response.error);
        }
      })
      .catch((error) => {
        console.log("Error creating Project:", error);
        setError("Error creating Project. Check Logs.");
        setSuccess("");
      });
  }

  return (
    <div className="modalOverlay">
      <form className="newProjectModal px-4 pt-3" onSubmit={formHandler}>
        <div className="d-flex justify-content-between align-items-center border-bottom">
          <h3>Create New Project</h3>
          <img
            src="https://www.svgrepo.com/show/509072/cross.svg"
            alt="Cross SVG File"
            width="35"
            height="35"
            onClick={closeModal}
          />
        </div>
        <div className="border-bottom pb-4">
          <label className="form-label mt-4 fs-5">Project Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Project Name"
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <label className="form-label mt-4 fs-5">Project Description</label>
          <textarea
            className="form-control"
            placeholder="Enter Project Description"
            rows="3"
            onChange={(e) => setProjectDescription(e.target.value)}
            required
          />
        </div>
        {error && (
          <div
            className="alert alert-danger py-2 mt-3 mb-0"
            style={{ fontSize: "14px" }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="alert alert-success py-2 mt-3 mb-0"
            style={{ fontSize: "14px" }}
          >
            {success}
          </div>
        )}
        <div className="my-3 d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
