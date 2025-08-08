import { NavLink, useNavigate } from "react-router";
import "../styles/main.css";

export default function Sidebar({ pageName, currentUserDetails }) {
  const navigate = useNavigate();

  function logOutHandler() {
    localStorage.removeItem("userToken");
    navigate("/login");
  }

  return (
    <section
      className="d-flex flex-column justify-content-between"
      style={{ height: "100vh", width: "20em", backgroundColor: "#efecf9" }}
    >
      <div className="container d-flex flex-column ps-5 py-4">
        <h2 className="mb-5" style={{ color: "#5840e9" }}>
          {" "}
          <strong>workasana</strong>{" "}
        </h2>
        <NavLink
          className="d-flex my-3 align-items-center text-decoration-none"
          to="/dashboard"
        >
          <img
            itemprop="contentUrl"
            src="https://www.svgrepo.com/show/448391/dashboard.svg"
            width="20"
            height="20"
            style={
              pageName == "Dashboard"
                ? {
                    filter:
                      "brightness(0) saturate(100%) invert(58%) sepia(88%) saturate(6988%) hue-rotate(247deg) brightness(94%) contrast(96%)",
                  }
                : { filter: "invert(0.4)" }
            }
          />
          <span
            className="fs-5 fw-normal ms-2"
            style={
              pageName == "Dashboard"
                ? { color: "#7d46ec" }
                : { color: "#666666" }
            }
          >
            Dashboard
          </span>
        </NavLink>
        <NavLink
          className="d-flex my-3 align-items-center text-decoration-none"
          to="/project"
        >
          <img
            itemprop="contentUrl"
            src="https://www.svgrepo.com/show/512328/grid-1525.svg"
            width="20"
            height="20"
            style={
              pageName == "Project"
                ? {
                    filter:
                      "brightness(0) saturate(100%) invert(58%) sepia(88%) saturate(6988%) hue-rotate(247deg) brightness(94%) contrast(96%)",
                  }
                : { filter: "invert(0.4)" }
            }
          />
          <span
            className="fs-5 fw-normal ms-2"
            style={
              pageName == "Project"
                ? { color: "#7d46ec" }
                : { color: "#666666" }
            }
          >
            Project
          </span>
        </NavLink>
        <NavLink
          className="d-flex my-3 align-items-center text-decoration-none"
          to="/team"
        >
          <img
            itemprop="contentUrl"
            src="https://www.svgrepo.com/show/347536/team.svg"
            width="20"
            height="20"
            style={
              pageName == "Team"
                ? {
                    filter:
                      "brightness(0) saturate(100%) invert(58%) sepia(88%) saturate(6988%) hue-rotate(247deg) brightness(94%) contrast(96%)",
                  }
                : { filter: "invert(0.4)" }
            }
          />
          <span
            className="fs-5 fw-normal ms-2"
            style={
              pageName == "Team" ? { color: "#7d46ec" } : { color: "#666666" }
            }
          >
            Team
          </span>
        </NavLink>
        <NavLink
          className="d-flex my-3 align-items-center text-decoration-none"
          to="/reports"
        >
          <img
            itemprop="contentUrl"
            src="https://www.svgrepo.com/show/352996/bar-graph.svg"
            width="20"
            height="20"
            style={
              pageName == "Reports"
                ? {
                    filter:
                      "brightness(0) saturate(100%) invert(58%) sepia(88%) saturate(6988%) hue-rotate(247deg) brightness(94%) contrast(96%)",
                  }
                : { filter: "invert(0.4)" }
            }
          />
          <span
            className="fs-5 fw-normal ms-2"
            style={
              pageName == "Reports"
                ? { color: "#7d46ec" }
                : { color: "#666666" }
            }
          >
            Reports
          </span>
        </NavLink>
        <NavLink className="d-flex my-3 align-items-center text-decoration-none">
          <img
            itemprop="contentUrl"
            src="https://www.svgrepo.com/show/458884/setting-line.svg"
            width="20"
            height="20"
            style={
              pageName == "Setting"
                ? {
                    filter:
                      "brightness(0) saturate(100%) invert(58%) sepia(88%) saturate(6988%) hue-rotate(247deg) brightness(94%) contrast(96%)",
                  }
                : { filter: "invert(0.4)" }
            }
          />
          <span
            className="fs-5 fw-normal ms-2"
            style={
              pageName == "Setting"
                ? { color: "#7d46ec" }
                : { color: "#666666" }
            }
          >
            Setting
          </span>
        </NavLink>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4 py-2 px-3 ">
        <div className="d-flex align-items-center">
          <img
            itemprop="contentUrl"
            src="https://www.svgrepo.com/show/92943/user.svg"
            alt="User SVG File"
            title="User SVG File"
            width="40"
            height="40"
            style={{
              filter:
                "invert(0%) sepia(95%) saturate(650%) hue-rotate(575deg) brightness(85%) contrast(105%)",
            }}
            className="me-2"
          />
          <div className="d-flex flex-column">
            <p className="m-0 p-0">
              <strong style={{ fontSize: "14px" }}>{currentUserDetails.name}</strong>
            </p>
            <p
              className="m-0 p-0"
              style={{ color: "#666666", fontSize: "12px" }}
            >
              {currentUserDetails.email}
            </p>
          </div>
        </div>
        <img
          itemprop="contentUrl"
          src="https://www.svgrepo.com/show/356468/logout.svg"
          alt="User SVG File"
          title="User SVG File"
          width="35"
          height="35"
          style={{ filter: "invert(0.3)" }}
          className="logOutBtn"
          onClick={logOutHandler}
        />
      </div>
    </section>
  );
}

// color: "#7d46ec"
// style={{ filter: "brightness(0) saturate(100%) invert(58%) sepia(88%) saturate(6988%) hue-rotate(247deg) brightness(94%) contrast(96%)"}}
// style={{ filter: "invert(0.4)"}}
// brightness(0) saturate(100%) invert(58%) sepia(88%) saturate(6988%) hue-rotate(247deg) brightness(84%) contrast(96%)
