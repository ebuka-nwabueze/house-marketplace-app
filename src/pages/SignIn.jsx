import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ReactComponent as ArrorRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth,email,password)
        if(userCredential.user){
            return navigate("/")
        }
    } catch (error) {
        toast.error("Incorrect User credentials")
    }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              id="email"
              className="emailInput"
              placeholder="Enter email address"
              value={email}
              onChange={onChange}
            />

            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="passwordInput"
                placeholder="Enter Password"
                value={password}
                onChange={onChange}
              />

              <img
                src={visibilityIcon}
                alt="ShowPassword"
                className="showPassword"
                onClick={() => {
                  setShowPassword((prevState) => {
                    return !prevState;
                  });
                }}
              />
            </div>

            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password?
            </Link>

            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrorRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>
          {/* Google OAuth */}

          <Link to="/sign-up" className="registerLink">
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignIn;
