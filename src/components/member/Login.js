import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/");
    }
  }, []); //hàm này chỉ chạy đúng 1 lần khi vào trang
  //bỏ ở đây để khi ng dùng đã login rồi thì ng dùng sẽ k vào đc trang login nữa, nếu muốn login phải logout

  const handleChangeInputs = (event) => {
    const { name, value } = event.target;
    // console.log({name});
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    //name để trong ngoặc vuoog là nó sẽ biến động là nó lúc sẽ lưu email lúc nó lưu password
  };
  



  function handleSubmit(e) {
    e.preventDefault();
    let errorsSubmit = {};
    let flag = true;
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!inputs.email) {
      errorsSubmit.email = " Vui lòng nhập email";
      flag = false;
    } else if (!regex.test(inputs.email)) {
      toast.error("Vui lòng nhập đúng định dạng email");
      flag = false;
    } else {
      console.log("Đã nhập đúng email");
    }
    if (!inputs.password) {
      errorsSubmit.password = " Vui lòng nhập mật khẩu";
      flag = false;
    }
    if (!flag) {
      setErrors(errorsSubmit);
    } else {
    //nếu ng dùng điền thông tin đăng nhập thành công nó k lỗi thì nó sẽ vào đây 
      setErrors({});
    //post lên api
      api
        .post("/login", inputs)
        .then((response) => {
          //ở đây là dữ liệu api nó trả về 
          let token = response.data.token;
          let Auth = response.data.Auth;

          // console.log(response.data.Auth);
          // console.log(response.data.token);

          console.log(response);
          // console.log(response.data.errors);
          
          //nếu như ng dùng nhập đúng với email, pass đã đăng ký thì lưu vào local rồi thông báo hiển thị lên rồi chuyển trang về home
          if (response.data.success) {
            let Token = JSON.stringify(token);
            // console.log(Token);
            localStorage.setItem("token", Token);
            let auth = JSON.stringify(Auth);
            // console.log(auth);
            localStorage.setItem("auth", auth);

            toast.success(response.data.success)  
            // toast.success("Bạn đã đăng nhập thành công")  
            // navigate("/")
            navigate("/blog/list")


          } else { // sai thì vào đây và thông báo hiển thị lỗi
            toast.warning(response.data.errors.errors);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <div className="col-sm-4 col-sm-offset-1">
      <div className="login-form">
        <h2>Login to your account</h2>
        <form action="#" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChangeInputs}
            />
            <p>&nbsp;{errors.email}</p>
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleChangeInputs}
            />
            <p>&nbsp;{errors.password}</p>
          </div>

          <span>
            <input type="checkbox" className="checkbox" />
            Keep me signed in
          </span>
          <br />
          <span>
            <Link to="/register">Do you have an account yet? Register ?</Link>
          </span>
          <button type="submit" className="btn btn-default">
            Login
          </button>
          <br />
        </form>
      </div>
    </div>
  );
}

export default Login;
