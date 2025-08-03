import { useEffect } from "react";
import useTokenCheck from "../utils/useTokenCheck";
import { useNavigate } from "react-router";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function SignUp() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const { tokenObject, loading } = useTokenCheck(`${apiBaseUrl}/auth/me`, token); // this will only be executed if we have both the values of token and url
  useEffect(() => {
    if (tokenObject.tokenVerified) return navigate("/dashboard");
  }, [tokenObject]);

  return (loading ? <h1>Loading...</h1> : <h1>Sign Up page..</h1>);
}
