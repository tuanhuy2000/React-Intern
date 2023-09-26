import { useEffect, useState } from "react";
import "./Login.scss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLoginRedux } from "../../redux/actions/userAction";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const isLoading = useSelector((state) => state.user.isLoading);
  const account = useSelector((state) => state.user.account);
  const dispatch = useDispatch();

  const nagative = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      nagative("/");
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !pass) {
      toast.error("missing value");
      return;
    } else {
      //"eve.holt@reqres.in"
      dispatch(handleLoginRedux(email, pass));
    }
  };

  const handleGoBack = () => {
    nagative("/");
  };

  const handlePressEnter = async (event) => {
    if (event && event.key === "Enter") {
      await handleLogin();
    }
  };

  useEffect(() => {
    if (account && account.auth) {
      nagative("/");
    }
  }, [account]);
  return (
    <>
      <div className="login-container col-12 col-sm-4">
        <div className="title">Log in</div>
        <div className="text">Email or username</div>
        <input
          type="text"
          placeholder="Email or username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="input-pass">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={pass}
            onChange={(event) => setPass(event.target.value)}
            onKeyDown={(event) => handlePressEnter(event)}
          />
          <i
            className={showPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
            onClick={() => setShowPass(!showPass)}
          ></i>
        </div>
        <button
          className={email && pass ? "active" : ""}
          onClick={() => handleLogin()}
        >
          {isLoading ? <i className="fa-solid fa-sync fa-spin"></i> : "Log in"}
        </button>
        <div className="back">
          <i className="fa-solid fa-angles-left"></i>
          <span onClick={() => handleGoBack()}>Go Back</span>
        </div>
      </div>
    </>
  );
};

export default Login;
