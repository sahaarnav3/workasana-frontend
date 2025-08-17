import { useNavigate } from "react-router";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useState } from "react";
import useTokenCheck from "../utils/useTokenCheck";
import axios from "axios";

//Components
import Sidebar from "../components/Sidebar";
import PeopleAvatar from "../components/PeopleAvatar";
import CreateNewTaskModal from "../components/CreateNewTaskModal";
import CreateNewProjectModal from "../components/CreateNewProjectModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [fetchFurtherData, setFetchFurtherData] = useState(false);
  const [loggedInUserTasks, setLoggedInUserTasks] = useState([]);
  const [projectWiseTasks, setProjectWiseTasks] = useState();
  // MODALS
  const [blurEnabled, setBlurEnabled] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const token = localStorage.getItem("userToken");
  const { tokenObject, loading } = useTokenCheck(
    `${apiBaseUrl}/auth/me`,
    token
  );
  useEffect(() => {
    if (tokenObject.tokenVerified) {
      setCurrentUser(tokenObject.tokenData);
      setFetchFurtherData(true);
    } else if (tokenObject.tokenData.error) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      setFetchFurtherData(false);
    }
  }, [tokenObject]);

  useEffect(() => {
    if (fetchFurtherData) {
      axios(`${apiBaseUrl}/tasks?owners=${currentUser._id}`, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          // console.log(response);
          if (response.status == 200)
            return setLoggedInUserTasks(response.data);
        })
        .catch((error) => console.log("Error fetching data:", error));
    }
  }, [fetchFurtherData, token, currentUser]);

  useEffect(() => {
    if (loggedInUserTasks) {
      let temp = loggedInUserTasks.reduce((acc, curr) => {
        const presentProjects = Object.keys(acc);
        if (!presentProjects.includes(curr.project.name))
          acc[curr.project.name] = { taskList: [curr] };
        else acc[curr.project.name].taskList.push(curr);
        return acc;
      }, {});
      const projectNames = Object.keys(temp);
      projectNames.forEach((project) => {
        const value = temp[project].taskList.reduce(
          (acc, curr) => curr.status === "Completed" && acc,
          true
        );
        temp[project].projectCompleted = value;
      });
      // console.log("temp", temp);
      setProjectWiseTasks(temp);
    }
  }, [loggedInUserTasks]);

  function formatDate(createdAt, daysToAdd = 0) {
    const newDate = new Date(createdAt);
    newDate.setDate(newDate.getDate() + daysToAdd);

    //Format Date in needed format e.g. - 20th Dec 2024
    const day = newDate.getDate();
    const month = newDate.toLocaleDateString("en-US", { month: "short" });
    const year = newDate.getFullYear();

    // Add suffix (st, nd, rd, th)
    const suffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return `${day}${suffix(day)} ${month} ${year}`;
  }

  function taskRender(eachTask) {
    const personArray = eachTask.team.members.reduce(
      // (acc, curr) => acc.push({ name: curr, initial: curr[0] }),
      (acc, curr) => [...acc, { name: curr, initial: curr[0] }],
      []
    );
    let color = { backgroundColor: "#fae69bff", color: "#b69947ff" };
    if (eachTask.status === "To Do")
      color = { backgroundColor: "#9abbeaff", color: "#4775b6ff" };
    else if (eachTask.status === "Completed")
      color = {
        backgroundColor: "rgb(213, 230, 222)",
        color: "rgb(51, 106, 70)",
      };
    else if (eachTask.status === "Blocked")
      color = {
        backgroundColor: "rgba(248, 185, 185, 1)",
        color: "rgba(188, 44, 44, 1)",
      };
    return (
      <div className="col-md-4 p-0" key={eachTask._id}>
        <div
          className="card me-4 p-1 border-0 rounded-3"
          style={{
            width: "27.5em",
            backgroundColor: "#f4f4f4ff",
            overflow: "scroll",
            scrollbarWidth: "none",
            scrollbarColor: "#d3d3d3 #ffffff",
          }}
        >
          <div className="card-body">
            <h6
              className="px-3 py-1 rounded-2"
              style={{
                backgroundColor: `${color.backgroundColor}`,
                color: `${color.color}`,
                width: "fit-content",
              }}
            >
              {eachTask.status}
            </h6>
            <h6 className="card-title mt-3 mb-0">
              <strong>{eachTask.name}</strong>
            </h6>
            <p className="mt-2" style={{ color: "grey" }}>
              <strong>
                Due on:{" "}
                {formatDate(eachTask.createdAt, eachTask.timeToComplete)}
              </strong>
            </p>
            <PeopleAvatar people={personArray} />
          </div>
        </div>
      </div>
    );
  }

  function closeModal() {
    setShowNewProjectModal(false);
    setShowNewTaskModal(false);
    setBlurEnabled(false);
  }
  function showProjectModal() {
    setShowNewProjectModal(true);
    setBlurEnabled(true);
  }
  function showTaskModal() {
    setShowNewTaskModal(true);
    setBlurEnabled(true);
  }

  //   return loading ? (
  //     <h3 className="m-5">Loading...</h3>
  //   ) : tokenObject?.tokenVerified ? (
  //     <main className="d-flex flex-row" style={{ width: "100vw" }}>
  //       <div>
  //         <Sidebar pageName="Dashboard" currentUserDetails={currentUser} />
  //       </div>
  //       <div className="" style={{ minWidth: "88em" }}>
  //         asdasd
  //       </div>
  //     </main>
  //   ) : (
  //     <h4 className="m-5">
  //       ACCESS FORBIDDEN. Redirecting to Login page in 5 seconds.
  //     </h4>
  //   );

  return (
    <>
      <main
        className={`d-flex flex-row ${blurEnabled ? "blurred" : ""}`}
        style={{ width: "100vw" }}
      >
        <Sidebar pageName="Dashboard" currentUserDetails={currentUser} />
        <div
          className=""
          style={{ minWidth: "88em", height: "100vh", overflowY: "auto" }}
        >
          {loading ? (
            <h3 className="m-5">Loading...</h3>
          ) : tokenObject?.tokenVerified ? (
            <section className="p-4">
              <div className="search input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                />
                <span className="input-group-text">
                  <img
                    src="https://www.svgrepo.com/show/491125/search.svg"
                    alt="Search Alt SVG File"
                    width="25"
                    height="25"
                  ></img>
                </span>
              </div>
              <div className="projectSection my-5">
                <div className="d-flex flex-row align-items-center">
                  <h2>
                    <strong>Projects</strong>
                  </h2>
                  <select
                    className="form-select ms-4 bg-body-secondary"
                    style={{ width: "10em" }}
                  >
                    <option value="All">All</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    className="btn btn-primary px-4 ms-auto rounded-1"
                    onClick={showProjectModal}
                  >
                    <strong>+ New Project</strong>
                  </button>
                </div>
                <div className="projectDisplay gy-3 d-flex my-3 py-3 ps-2">
                  {projectWiseTasks ? (
                    Object.keys(projectWiseTasks).map((project) => (
                      <div className="col-md-4 p-0" key={project}>
                        <div
                          className="card me-4 p-1 border-0 rounded-3"
                          style={{
                            width: "27.5em",
                            height: "17em",
                            backgroundColor: "#f4f4f4ff",
                            overflow: "scroll",
                            scrollbarWidth: "none",
                            scrollbarColor: "#d3d3d3 #ffffff",
                          }}
                        >
                          <div className="card-body">
                            <h6
                              className="px-3 py-1 rounded-2"
                              style={
                                projectWiseTasks[project].projectCompleted
                                  ? {
                                      backgroundColor: "rgb(213 230 222)",
                                      color: "rgb(51 106 70)",
                                      width: "fit-content",
                                    }
                                  : {
                                      backgroundColor: "#fae69bff",
                                      color: "#b69947ff",
                                      width: "fit-content",
                                    }
                              }
                            >
                              {projectWiseTasks[project].projectCompleted
                                ? "Completed"
                                : "In Progress"}
                            </h6>
                            <h6 className="card-title mt-3 mb-0">
                              <strong>
                                {
                                  projectWiseTasks[project].taskList[0].project
                                    .name
                                }
                              </strong>
                            </h6>
                            <p className="card-text">
                              {
                                projectWiseTasks[project].taskList[0].project
                                  .description
                              }
                            </p>
                            {projectWiseTasks[project].taskList.map((task) => (
                              <div
                                className="d-flex flex-column"
                                key={task._id}
                              >
                                <div className="d-flex align-items-center">
                                  <img
                                    src={
                                      task.status === "Completed"
                                        ? "https://www.svgrepo.com/show/514262/tick-checkbox.svg"
                                        : "https://www.svgrepo.com/show/510902/checkbox-unchecked.svg"
                                    }
                                    alt="Tick Checkbox SVG File"
                                    width="20"
                                    height="20"
                                  />
                                  <span className="ms-2">
                                    <strong>{task.name}</strong>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h3 className="m-5">Loading...</h3>
                  )}
                </div>
              </div>
              <div className="taskSection my-5">
                <div className="d-flex flex-row align-items-center">
                  <h2>
                    <strong>Tasks</strong>
                  </h2>
                  <select
                    className="form-select ms-4 bg-body-secondary"
                    style={{ width: "10em" }}
                  >
                    <option value="All">All</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    className="btn btn-primary px-4 ms-auto rounded-1"
                    onClick={showTaskModal}
                  >
                    <strong>+ New Task</strong>
                  </button>
                </div>
                <div className="projectDisplay gy-3 d-flex my-4 py-3 ps-2">
                  {loggedInUserTasks ? (
                    loggedInUserTasks.map((eachTask) => taskRender(eachTask))
                  ) : (
                    <h3 className="m-5">Loading...</h3>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <h4 className="m-5">
              ACCESS FORBIDDEN. Redirecting to Login page in 5 seconds.
            </h4>
          )}
        </div>
      </main>
      {/* ALL THE MODALS */}
      {showNewProjectModal ? (
        <CreateNewProjectModal closeModal={closeModal} token={token} />
      ) : (
        ""
      )}
      {showNewTaskModal ? (
        <CreateNewTaskModal closeModal={closeModal} tokenVerified={tokenObject.tokenVerified} setLoggedInUserTasks={setLoggedInUserTasks} loggedInUserTasks={loggedInUserTasks} token={token} />
      ) : (
        ""
      )}
    </>
  );
}
