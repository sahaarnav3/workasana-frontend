import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useState } from "react";
import useTokenCheck from "../utils/useTokenCheck";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  // const [ showModal, setShowModal ] = useState({});
  const [fetchFurtherData, setFetchFurtherData] = useState(false);
  const [loggedInUserTasks, setLoggedInUserTasks] = useState();
  const [projectWiseTasks, setProjectWiseTasks] = useState();

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
  }, [fetchFurtherData]);

  // useEffect(() => {
  //   if(loggedInUserTasks)
  //     console.log("loggedinuserdeets", loggedInUserTasks);
  // }, [loggedInUserTasks])

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
          (acc, curr) => curr.status === "Completed",
          true
        );
        temp[project].projectCompleted = value;
      });
      // console.log("temp", temp);
      setProjectWiseTasks(temp);
    }
  }, [loggedInUserTasks]);

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
    <main className="d-flex flex-row" style={{ width: "100vw" }}>
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
                  <option value="To DO">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button className="btn btn-primary px-4 ms-auto rounded-1">
                  <strong>+ New Project</strong>
                </button>
              </div>
              <div className="projectDisplay gy-3 d-flex my-3 py-3 ps-2">
                {/* <div className="col-md-4 p-0">
                  <div
                    className="card me-4 p-1 border-0 rounded-3"
                    style={{
                      width: "27.5em",
                      height: "12em",
                      backgroundColor: "#f4f4f4ff",
                    }}
                  >
                    <div className="card-body">
                      <h6
                        className="px-3 py-1 rounded-2"
                        style={{
                          backgroundColor: "#fae69bff",
                          color: "#b69947ff",
                          width: "fit-content",
                        }}
                      >
                        In Progress
                      </h6>
                      <h6 className="card-title mt-4 mb-0">
                        <strong>Proj Name</strong>
                      </h6>
                      <p className="card-text">
                        Revamp the existing company website with a modern UI,
                        improved navigation, and responsive layouts for all
                        devices.
                      </p>
                    </div>
                  </div>
                </div> */}
                {projectWiseTasks ? (
                  Object.keys(projectWiseTasks).map((project) => (
                    <div className="col-md-4 p-0" key={project}>
                      <div
                        className="card me-4 p-1 border-0 rounded-3"
                        style={{
                          width: "27.5em",
                          height: "12em",
                          backgroundColor: "#f4f4f4ff",
                        }}
                      >
                        <div className="card-body">
                          <h6
                            className="px-3 py-1 rounded-2"
                            style={{
                              backgroundColor: "#fae69bff",
                              color: "#b69947ff",
                              width: "fit-content",
                            }}
                          >
                            {projectWiseTasks[project].projectCompleted
                              ? "Completed"
                              : "In Progress"}
                          </h6>
                          <h6 className="card-title mt-4 mb-0">
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
                        </div>
                      </div>
                    </div>
                  ))
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
  );
}
