import { useNavigate, useParams } from "react-router";
import Sidebar from "../components/Sidebar";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useState } from "react";
import useTokenCheck from "../utils/useTokenCheck";
import axios from "axios";

export default function Project() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [fetchedTasksList, setFetchedTasksList] = useState([]);
  const [projectData, setProjectData] = useState({})
  const projectId = useParams().projectId;

  const token = localStorage.getItem("userToken");
  const { tokenObject, loading } = useTokenCheck(
    `${apiBaseUrl}/auth/me`,
    token
  );
  useEffect(() => {
    if(!projectId)
      return navigate("/dashboard")
    if (tokenObject.tokenVerified) setCurrentUser(tokenObject.tokenData);
    else if (tokenObject.tokenData.error) {
      setTimeout(() => {
        return navigate("/login");
      }, 5000);
    }
  }, [tokenObject]);

  useEffect(() => {
    if(projectId){
      axios(`${apiBaseUrl}/tasks?project=${projectId}`, {
        headers: {
          authorization: token,
          "Content-Type": 'application/json'
        }
      })
      .then(response => {
        // console.log(response.data)
        if(response.status == 200){
          setFetchedTasksList(response.data);
          if(response.data.length > 0)
            setProjectData(response.data[0].project);
          console.log("projetdata", response.data[0].project)
        }
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      })
    }
  }, [projectId])

  return (
    <main className="d-flex flex-row" style={{ width: "100vw" }}>
      <Sidebar pageName="Project" currentUserDetails={currentUser} />
      <div className="" style={{ minWidth: "88em" }}>
        {loading ? (
          <h3 className="m-5">Loading...</h3>
        ) : tokenObject?.tokenVerified ? (
          <section className="p-4">

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
