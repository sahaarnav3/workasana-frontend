import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useState } from "react";
import useTokenCheck from "../utils/useTokenCheck";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});

  const token = localStorage.getItem("userToken");
  const { tokenObject, loading } = useTokenCheck(
    `${apiBaseUrl}/auth/me`,
    token
  );
  useEffect(() => {
    if (tokenObject.tokenVerified) 
      setCurrentUser(tokenObject.tokenData);
    else if(tokenObject.tokenData.error) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  }, [tokenObject]);

  return loading ? (
    <h3 className="m-5">Loading...</h3>
  ) : tokenObject?.tokenVerified ? (
    <main className="d-flex flex-row" style={{ width: "100vw" }}>
      <div>
        <Sidebar
          pageName="Dashboard"
          currentUserDetails={currentUser}
        />
      </div>
      <div className="" style={{ minWidth: "88em" }}>
        asdasd
      </div>
    </main>
  ) : (
    <h4 className="m-5">
      ACCESS FORBIDDEN. Redirecting to Login page in 5 seconds.
    </h4>
  );
}
