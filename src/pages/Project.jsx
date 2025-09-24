import { useNavigate, useParams, NavLink } from "react-router";
import Sidebar from "../components/Sidebar";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useState } from "react";
import useTokenCheck from "../utils/useTokenCheck";
import axios from "axios";
import PeopleAvatar from "../components/PeopleAvatar";

export default function Project() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [fetchedTasksList, setFetchedTasksList] = useState([]);
  const [filteredTaskList, setFilteredTaskList] = useState([]);
  const [projectData, setProjectData] = useState({});
  const projectId = useParams().projectId;

  const token = localStorage.getItem("userToken");
  const { tokenObject, loading } = useTokenCheck(
    `${apiBaseUrl}/auth/me`,
    token
  );
  useEffect(() => {
    if (!projectId) return navigate("/dashboard");
    if (tokenObject.tokenVerified) setCurrentUser(tokenObject.tokenData);
    else if (tokenObject.tokenData.error) {
      setTimeout(() => {
        return navigate("/login");
      }, 5000);
    }
  }, [tokenObject]);

  useEffect(() => {
    if (projectId) {
      axios(`${apiBaseUrl}/tasks?project=${projectId}`, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response.data);
          if (response.status == 200) {
            setFetchedTasksList(response.data);
            setFilteredTaskList(response.data);
            if (response.data.length > 0)
              setProjectData(response.data[0].project);
            // console.log("projetdata", response.data[0].project);
          }
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    }
  }, [projectId]);

  const personArr = [
    { name: "asdadsad", initial: "a" },
    { name: "asdadsad", initial: "a" },
    { name: "asdadsad", initial: "a" },
    { name: "asdadsad", initial: "a" },
    { name: "asdadsad", initial: "a" },
    { name: "asdadsad", initial: "a" },
  ];

  const priorityFromTag = (tagValue) => {
    if (tagValue == "Important")
      return (
        <p
          className="border border-1 px-3 pb-1 m-0"
          style={{
            display: "inline-block",
            borderRadius: "40px",
            backgroundColor: "#5940e841",
            color: "#5940e8",
          }}
        >
          {" "}
          <span className="fs-5 me-1">⚐</span> Medium
        </p>
      );
    else if (tagValue == "Urgent")
      return (
        <p
          className="border border-1 px-3 pb-1 m-0"
          style={{
            display: "inline-block",
            borderRadius: "40px",
            backgroundColor: "#e8404041",
            color: "#e84040ff",
          }}
        >
          {" "}
          <span className="fs-5 me-1">⚐</span> High
        </p>
      );
    else
      return (
        <p
          className="border border-1 px-3 pb-1 m-0"
          style={{
            display: "inline-block",
            borderRadius: "40px",
            backgroundColor: "#f1f1f1ff",
            color: "#6a6a6aff",
          }}
        >
          {" "}
          <span className="fs-5 me-1">⚐</span> Medium
        </p>
      );
  };

  function taskStatusRender(statusValue) {
    if (statusValue == "Completed")
      return (
        <p
          className="border border-1 px-3 fw-bold py-1 m-0"
          style={{
            display: "inline-block",
            borderRadius: "5px",
            backgroundColor: "rgb(213, 230, 222)",
            color: "rgb(51, 106, 70)",
          }}
        >
          Completed
        </p>
      );
    else if (statusValue == "In Progress")
      return (
        <p
          className="border border-1 px-3 fw-bold py-1 m-0"
          style={{
            display: "inline-block",
            borderRadius: "5px",
            backgroundColor: "#fae69bff",
            color: "#b69947ff",
          }}
        >
          In Progress
        </p>
      );
    else if (statusValue == "Blocked")
      return (
        <p
          className="border border-1 px-3 fw-bold py-1 m-0"
          style={{
            display: "inline-block",
            borderRadius: "5px",
            backgroundColor: "rgba(248, 185, 185, 1)",
            color: "rgba(188, 44, 44, 1)",
          }}
        >
          Blocked
        </p>
      );
    else
      return (
        <p
          className="border border-1 px-3 fw-bold py-1 m-0"
          style={{
            display: "inline-block",
            borderRadius: "5px",
            backgroundColor: "#9abbeaff",
            color: "#4775b6ff",
          }}
        >
          To Do
        </p>
      );
  }

  function dateRendered(createdAt, timeToComplete = 0) {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + timeToComplete);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  }

  return (
    <main className="d-flex flex-row" style={{ width: "100vw" }}>
      <Sidebar pageName="Project" currentUserDetails={currentUser} />
      <div className="" style={{ minWidth: "88em" }}>
        {loading ? (
          // <h3 className="m-5">Loading...</h3>
          <h5 className="card-title placeholder-glow m-5">
            <span
              className="placeholder col-6 bg-secondary"
              style={{ width: "50vw" }}
            ></span>
            <br />
            <span
              className="placeholder col-6 bg-warning"
              style={{ width: "30vw" }}
            ></span>
            <br />
            <span
              className="placeholder col-6 bg-success"
              style={{ width: "20vw" }}
            ></span>
          </h5>
        ) : tokenObject?.tokenVerified ? (
          <section className="p-4">
            <div className="gy-3 my-3 py-3 ps-2">
              {projectData && fetchedTasksList ? (
                <section className="main-content">
                  {console.log(fetchedTasksList)}
                  <div className="mb-5">
                    <h3 className="mb-4">{projectData.name}</h3>
                    <p className="text-secondary">{projectData.description}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <label>Sort By:</label>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-2 fw-normal ms-2 mx-1"
                        style={{ borderRadius: "18px", fontSize: "13px" }}
                      >
                        Priority Low-High
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-2 fw-normal mx-1"
                        style={{ borderRadius: "18px", fontSize: "13px" }}
                      >
                        Priority High-Low
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-2 fw-normal mx-1"
                        style={{ borderRadius: "18px", fontSize: "13px" }}
                      >
                        Newest First
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-2 fw-normal mx-1"
                        style={{ borderRadius: "18px", fontSize: "13px" }}
                      >
                        Oldest First
                      </button>
                    </div>
                    <div className="d-flex align-items-center">
                      <select
                        className="px-3 me-3 py-2 bg-body-secondary border-0 rounded"
                        style={{ width: "90px" }}
                      >
                        <option value="All">All</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button className="btn btn-primary px-3 px-1">
                        + New Task
                      </button>
                    </div>
                  </div>
                  <div className="main-table">
                    <table className="table mt-4 ">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="ps-3 py-3 text-secondary"
                            style={{
                              backgroundColor: "#e9f1fe",
                              width: "20%",
                              borderTopLeftRadius: "8px",
                            }}
                          >
                            TASKS
                          </th>
                          <th
                            scope="col"
                            className="ps-3 py-3 text-secondary"
                            style={{ backgroundColor: "#e9f1fe", width: "20%" }}
                          >
                            OWNER
                          </th>
                          <th
                            scope="col"
                            className="ps-3 py-3 text-secondary"
                            style={{ backgroundColor: "#e9f1fe", width: "20%" }}
                          >
                            PRIORITY
                          </th>
                          <th
                            scope="col"
                            className="ps-3 py-3 text-secondary"
                            style={{ backgroundColor: "#e9f1fe", width: "20%" }}
                          >
                            DUE ON
                          </th>
                          <th
                            scope="col"
                            className="ps-3 py-3 text-secondary"
                            style={{
                              backgroundColor: "#e9f1fe",
                              width: "16%",
                            }}
                          >
                            STATUS
                          </th>
                          <th
                            scope="col"
                            className="ps-3 py-3"
                            style={{
                              backgroundColor: "#e9f1fe",
                              borderTopRightRadius: "8px",
                            }}
                          ></th>
                        </tr>
                      </thead>
                      {filteredTaskList.length > 0 ? (
                        filteredTaskList.map((task) => (
                          <tbody>
                            <tr>
                              <td className="ps-3 py-3 border fw-bold">
                                {task.name}
                              </td>
                              <td className="ps-3 py-3 border">
                                <div className="m-0 p-0">
                                  <PeopleAvatar
                                    people={task?.team?.members.reduce(
                                      (acc, curr) => [
                                        ...acc,
                                        {
                                          name: curr,
                                          initial: curr[0],
                                        },
                                      ],
                                      []
                                    )}
                                  />
                                </div>
                              </td>
                              <td className="ps-3 py-3 border">
                                {priorityFromTag(task.tags[0])}
                              </td>
                              <td className="ps-3 py-3 border fw-bold">
                                {dateRendered(
                                  task.createdAt,
                                  task.timeToComplete
                                )}
                              </td>
                              <td className="ps-3 py-3 border">
                                {taskStatusRender(task.status)}
                              </td>
                              <td className="ps-3 py-3 border fw-bold">
                                {" "}
                                <NavLink className="text-decoration-none text-dark">
                                  →
                                </NavLink>{" "}
                              </td>
                            </tr>
                          </tbody>
                        ))
                      ) : (
                        <tbody>
                          <tr>
                            <td className="ps-3 py-3 border fw-bold">
                              <span
                                className="placeholder bg-secondary"
                                style={{ width: "20%" }}
                              ></span>
                            </td>
                            <td className="ps-3 py-3 border">
                              <div className="m-0 p-0">
                                <span
                                  className="placeholder bg-secondary"
                                  style={{ width: "20%" }}
                                ></span>
                              </div>
                            </td>
                            <td className="ps-3 py-3 border">
                              <span
                                className="placeholder bg-secondary"
                                style={{ width: "20%" }}
                              ></span>
                            </td>
                            <td className="ps-3 py-3 border fw-bold">
                              <span
                                className="placeholder bg-secondary"
                                style={{ width: "20%" }}
                              ></span>
                            </td>
                            <td className="ps-3 py-3 border">
                              <span
                                className="placeholder bg-secondary"
                                style={{ width: "20%" }}
                              ></span>
                            </td>
                            <td className="ps-3 py-3 border fw-bold">
                              {" "}
                              <NavLink className="text-decoration-none text-dark">
                                →
                              </NavLink>{" "}
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </section>
              ) : (
                <h5 className="card-title placeholder-glow">
                  <span
                    className="placeholder col-6 bg-secondary"
                    style={{ width: "50vw" }}
                  ></span>
                  <br />
                  <span
                    className="placeholder col-6 bg-warning"
                    style={{ width: "30vw" }}
                  ></span>
                  <br />
                  <span
                    className="placeholder col-6 bg-success"
                    style={{ width: "20vw" }}
                  ></span>
                </h5>
              )}
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
