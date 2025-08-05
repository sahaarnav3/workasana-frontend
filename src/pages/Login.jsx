import { useEffect, useState } from "react";
import useTokenCheck from "../utils/useTokenCheck";
import { useNavigate } from "react-router";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessageObject, setAlertMessageObject] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const { tokenObject, loading } = useTokenCheck(
    `${apiBaseUrl}/auth/me`,
    token
  ); // this will only be executed if we have both the values of token and url
  useEffect(() => {
    if (tokenObject.tokenVerified) navigate("/dashboard");
  }, [tokenObject]);

  async function formHandler(e) {
    e.preventDefault();
    const loginUserUrl = `${apiBaseUrl}/auth/login`;
    const requestBody = {
      email: email,
      password: password,
    };
    // console.log("yahan ayisss", requestBody);
    fetch(loginUserUrl, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          localStorage.setItem('userToken', data.userToken);
          return navigate("/dashboard");
        } else {
          setAlertMessageObject({
            success: false,
            message: data.error,
          });
        }
      })
      .catch((error) => console.log(error));
  }

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <section
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <form
        className="m-4 py-3 px-4 d-flex flex-column"
        style={{ margin: "auto", width: "27em" }}
        onSubmit={formHandler}
      >
        <h4
          className="fw-semibold mb-4 text-center"
          style={{ color: "#5f47ee" }}
        >
          workasana
        </h4>
        <p className="mb-2 fs-2 text-center">Log in to your account</p>
        <p style={{ color: "grey" }} className="mb-2 text-center">
          Please enter your details.
        </p>
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control mb-4"
          placeholder="Enter Your Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="btn text-white mb-3"
          type="submit"
          style={{ backgroundColor: "#5f47ee" }}
        >
          Sign in
        </button>
        <span className="text-center text-secondary">
          Don't have an account?{" "}
          <a
            className="text-center text-decoration-none"
            href="/signup"
            style={{ color: "#5f47ee" }}
          >
            Sign Up
          </a>
        </span>

        {alertMessageObject?.message ? (
          <div
            class="alert alert-danger alert-dismissible fade show mt-3"
            role="alert"
          >
            <strong>Error!</strong> {alertMessageObject.message}
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        ) : (
          <div></div>
        )}
      </form>
    </section>
  );
}
