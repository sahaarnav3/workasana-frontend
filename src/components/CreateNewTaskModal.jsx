import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function CreateNewTaskModal({
  closeModal,
  tokenVerified,
  setLoggedInUserTasks,
  loggedInUserTasks,
  token,
}) {
  const [projectName, setProjectName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [owners, setOwners] = useState([]);
  const [tags, setTags] = useState([]);
  const [timeToComplete, setTimeToComplete] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //Storing all fetched data from Mongoose.
  const [listOfProjects, setListOfProjects] = useState();
  const [listOfTeams, setListOfTeams] = useState();
  const [listOfOwners, setListOfOwners] = useState();
  const [listOfTags, setListOfTags] = useState();

  useEffect(() => {
    if (tokenVerified) {
      //To fetch all projects
      axios(`${apiBaseUrl}/projects`, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          if (response.status === 200) setListOfProjects(response.data);
        })
        .catch((error) => console.log("Error fetching Project data:", error));

      //To fetch all teams
      axios(`${apiBaseUrl}/teams`, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          if (response.status === 200) setListOfTeams(response.data);
        })
        .catch((error) => console.log("Error fetching Team data:", error));

      //To fetch all owners (users)
      axios(`${apiBaseUrl}/auth/users`, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          if (response.status === 200)
            setListOfOwners(
              response.data.map((user) => ({
                value: user._id,
                label: user.name,
              }))
            );
        })
        .catch((error) => console.log("Error fetching Team data:", error));

      //To fetch all Tags
      axios(`${apiBaseUrl}/tags`, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          if (response.status === 200)
            setListOfTags(
              response.data.tagResponse.map((tag) => ({
                value: tag.name,
                label: tag.name,
              }))
            );
        })
        .catch((error) => console.log("Error fetching Tag data:", error));
    }
  }, [tokenVerified]);

  function teamHandler(e) {
    setTeamName(e.target.value);
    // if (e.target.value === "none") return setListOfOwners();
    // setListOfOwners(
    //   listOfTeams
    //     .filter((team) => team._id === e.target.value)[0]
    //     .members.map((member) => ({ value: member._id, label: member }))
    // );
  }

  async function submitFormHandler(e) {
    e.preventDefault();
    if (projectName.length < 1) {
      setError("Please select a project.");
      return;
    }
    if (taskName.length < 1) {
      setError("Please write a proper Project Name.");
      return;
    }
    if (teamName.length < 1) {
      setError("Please select a proper Team Name.");
      return;
    }
    if (owners.length < 1) {
      setError("Please select Owners.");
      return;
    }
    if (tags.length < 1) {
      setError("Please select Tags.");
      return;
    }
    if (timeToComplete < 1) {
      setError("Please Give Proper Time to Complete.");
      return;
    }
    if (status.length < 1 || status == "none") {
      setError("Please select Status.");
      return;
    }
    const requestBody = {
      name: taskName,
      project: projectName,
      team: teamName,
      owners: owners.map((owner) => owner.value),
      tags: tags.map((tag) => tag.value),
      timeToComplete: timeToComplete,
      status: status,
    };
    // console.log("all values - ", requestBody);
    axios
      .post(`${apiBaseUrl}/tasks`, requestBody, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(response)
        if (response.status === 200) {
          setError("");
          setSuccess("Task Created Successfully.");
          console.log("loggedinuer", loggedInUserTasks);
          console.log("response", response.data.data);
          setLoggedInUserTasks([...loggedInUserTasks, response.data.data]);
        } else {
          setError(response.error);
          setSuccess("");
        }
      })
      .catch((error) => {
        console.log("Error creating task:", error);
        setError("Error creating Task. Check Logs.");
        setSuccess("");
      });
  }

  return (
    <div className="modalOverlay">
      <div className="newProjectModal px-4 pt-3">
        <div className="d-flex justify-content-between align-items-center border-bottom">
          <h4>Create New Task</h4>
          <img
            src="https://www.svgrepo.com/show/509072/cross.svg"
            alt="Cross SVG File"
            width="35"
            height="35"
            onClick={closeModal}
          />
        </div>
        <form onSubmit={submitFormHandler}>
          <div className="pb-">
            <label className="form-label mt-4" style={{ fontSize: "14px" }}>
              Select Project
            </label>
            <select
              className="form-select"
              onChange={(e) => setProjectName(e.target.value)}
              style={{ fontSize: "14px" }}
              required
            >
              <option value="none">Select Project</option>
              {listOfProjects ? (
                listOfProjects.map((project) => (
                  <option value={project._id} key={project._id}>
                    {project.name}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </select>
            <label className="form-label mt-4" style={{ fontSize: "14px" }}>
              Task Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Task Name"
              onChange={(e) => setTaskName(e.target.value)}
              style={{ fontSize: "14px" }}
            />
            <label className="form-label mt-4" style={{ fontSize: "14px" }}>
              Select Team
            </label>
            <select
              className="form-select"
              onChange={teamHandler}
              style={{ fontSize: "14px" }}
            >
              <option value="none">Select Team</option>
              {listOfTeams ? (
                listOfTeams.map((team) => (
                  <option value={team._id} key={team._id}>
                    {team.name}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </select>
            <label className="form-label mt-4" style={{ fontSize: "14px" }}>
              Select Owners
            </label>
            <Select
              isMulti
              options={
                listOfOwners
                  ? listOfOwners
                  : [{ value: "0", label: "Loading..." }]
              }
              placeholder="Select Owner(s)"
              value={owners}
              onChange={setOwners}
            />
            <label className="form-label mt-4" style={{ fontSize: "14px" }}>
              Select Tags
            </label>
            <Select
              isMulti
              options={
                listOfTags ? listOfTags : [{ value: "0", label: "Loading..." }]
              }
              placeholder="Select Tag(s)"
              value={tags}
              onChange={setTags}
            />
            <label className="form-label mt-4" style={{ fontSize: "14px" }}>
              Estimated Time to Complete (days)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Time in Days"
              onChange={(e) => setTimeToComplete(e.target.value)}
              style={{ fontSize: "14px" }}
            />
            <label className="form-label mt-4" style={{ fontSize: "14px" }}>
              Select Status
            </label>
            <select
              className="form-select"
              onChange={(e) => setStatus(e.target.value)}
              style={{ fontSize: "14px" }}
            >
              <option value="none">Select Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
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
          <div className="mb-3 d-flex justify-content-end">
            <button
              className="btn btn-secondary mt-3 me-2"
              onClick={closeModal}
              style={{ fontSize: "14px" }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary mt-3"
              type="submit"
              style={{ fontSize: "14px" }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
