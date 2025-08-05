import { useEffect, useState } from "react";
import useTokenCheck from "../utils/useTokenCheck";
import { useNavigate } from "react-router";
import "../styles/main.css";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [alertMessageObject, setAlertMessageObject] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const { tokenObject, loading } = useTokenCheck(
    `${apiBaseUrl}/auth/me`,
    token
  ); // this will only be executed if we have both the values of token and url
  useEffect(() => {
    if (tokenObject.tokenVerified) return navigate("/dashboard");
  }, [tokenObject]);

  async function formHandler(e) {
    e.preventDefault();
    const createUserUrl = `${apiBaseUrl}/auth/signup`;
    const requestBody = {
      name: name,
      email: email,
      password: password,
    };
    if (password === confirmPassword && termsAccepted) {
      fetch(createUserUrl, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async response => {
        const data = await response.json();
        if (response.status === 200) {
          setAlertMessageObject({
            success: true,
            message: "User Created Successfully. Please goto Login Screen.",
          });
        } else
          setAlertMessageObject({
            success: false,
            message: data.error,
          });
      })
      .catch(error => console.log(error))
    } else if (password !== confirmPassword) {
      setAlertMessageObject({
        success: false,
        message:
          "Password & Confirm Password are not matching. Please try again.",
      });
    } else {
      setAlertMessageObject({
        success: false,
        message: "Please accept the terms and conditions.",
      });
    }
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
        onSubmit={formHandler}
        style={{ margin: "auto", width: "27em" }}
      >
        <h4
          className="fw-semibold mb-4 text-center"
          style={{ color: "#5f47ee" }}
        >
          workasana
        </h4>
        <p className="mb-2 fs-2 text-center">Create New Account</p>
        <p style={{ color: "grey" }} className="mb-2 text-center">
          Please enter your details.
        </p>
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control mb-4"
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
        <label className="form-label">Confirm Password</label>
        <input
          type="password"
          className="form-control mb-4"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="form-check mb-3" style={{ margin: "auto" }}>
          <input
            className="form-check-input"
            type="checkbox"
            onChange={(e) => setTermsAccepted(e.target.checked)}
            id="checkDefault"
          />
          <label className="form-check-label" for="checkDefault">
            I accept Terms & Conditions
          </label>
        </div>
        <button className="btn text-white mb-3" type="submit" style={{ backgroundColor: "#5f47ee"}}>
          Create Account
        </button>
        <a className="mb-4 text-center text-decoration-none" href="/login" style={{ color: "#5f47ee"}}>
          Already have an account ?
        </a>

        {alertMessageObject?.message ? (
          alertMessageObject.success ? (
            <div
              class="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              <strong>Success!</strong> {alertMessageObject.message}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          ) : (
            <div
              class="alert alert-danger alert-dismissible fade show"
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
          )
        ) : (
          <div></div>
        )}
      </form>
    </section>
  );
}
