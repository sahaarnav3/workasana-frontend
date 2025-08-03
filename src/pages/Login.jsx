import { useEffect } from "react";
import useTokenCheck from "../utils/useTokenCheck";
import { useNavigate } from "react-router";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const { tokenObject, loading } = useTokenCheck(`${apiBaseUrl}/auth/me`, token); // this will only be executed if we have both the values of token and url
  useEffect(() => {
    if (tokenObject.tokenVerified) navigate("/dashboard");
  }, [tokenObject]);

  return loading ? <h1>Loading...</h1> : <h1>This is login page</h1>;
}
