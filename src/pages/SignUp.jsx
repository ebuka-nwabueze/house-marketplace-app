import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { ReactComponent as ArrorRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";


function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // get back the user instance driectly from firestore
      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // save the user data to users collection
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      console.log(formDataCopy);
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      // re-route on success to home page
      navigate("/");
    } catch (error) {
      console.log(error);
      if (!name && !email && !password) {
        toast.warning("Please ensure all sign up details are filled");
      } else {
        toast.error("Something went wrong during registration");
      }
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Create an Account</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              id="name"
              className="nameInput"
              placeholder="Full Name"
              value={name}
              onChange={onChange}
            />

            <input
              type="email"
              id="email"
              className="emailInput"
              placeholder="Email address"
              value={email}
              onChange={onChange}
            />

            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="passwordInput"
                placeholder="Password"
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

            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrorRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>
          <OAuth/>

          <Link to="/sign-in" className="registerLink">
            Have an Account? Sign In here
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignUp;
