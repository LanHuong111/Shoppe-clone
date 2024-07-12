import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { api } from "../../api";
import { toast } from "react-toastify";

function Register() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatar: "",
    level: 0,
  });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(""); //để luu thông tin hình ảnh để check image va size
  const [avatar, setAvatar] = useState(""); // để lưu hình ảnh mã hóa và gửi qua api
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);
  // useEffect này là check xem có token chưa, có rồi thì k đc đăng kí lại

  const handleChangeInputs = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  }; // change để lưu dữ liệu ng dùng đang nhập
  console.log(inputs);

  function handleUserInputFile(e) {
    const file = e.target.files[0]; // thông tin hình ảnh
    // console.log(file);
    let reader = new FileReader();
    reader.onload = (e) => {
      // console.log(e.target.result);
      setAvatar(e.target.result); // cái này để gửi api (base 64)
      setFile(file); //cái này để lưu toàn bộ thông tin file upload
    };
    reader.readAsDataURL(file); //đoạn function chỗ này dùng để chuyển ảnh qua base 64 là 1 chuỗi vì api nó chỉ nhận chuỗi
  }

  // console.log({ avatar });
  //chỗ này log ra xem đã mã hóa thành chuỗi hay chưa(base 64)
  //Do avatar upload lên trả về 1 array, nên gửi qua api k dc, vi vậy ta phải mã hoá bằng avatar 1chuỗi

  function handleSubmit(e) {
    e.preventDefault();
    let errorsSubmit = {};
    let flag = true;
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    // console.log(file);
    console.log(inputs);

    if (!inputs.name) {
      errorsSubmit.name = " Vui lòng nhập tên";
      flag = false;
    }
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
    if (!inputs.phone) {
      errorsSubmit.phone = " Vui lòng nhập số điện thoại";
      flag = false;
    }
    if (!inputs.address) {
      errorsSubmit.address = " Vui lòng nhập địa chỉ";
      flag = false;
    }
    if (!file) {
      errorsSubmit.avatar = " Vui lòng chọn hình ảnh ";
      flag = false;
    } else {
      const type = file.type;
      const size = file.size;
      if (!type.includes("image")) {
        toast.error("Vui lòng chọn hình ảnh");
        flag = false;
      } else {
        if (size > 1024 * 1024) {
          toast.warning("File tải lên quá lớn");
          flag = false;
        } else {
          inputs.avatar = avatar;
          console.log("Ảnh tải lên thành công");
        }
      }
    }

    if (!flag) {
      setErrors(errorsSubmit);
    } else {
      setErrors({});

      api
        .post("/register", inputs)
        .then((response) => {
          console.log(response);
          toast.success("Bạn đăng kí thành công");
          navigate("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <div className="col-sm-4">
      <div className="signup-form">
        <h2>Register</h2>
        {/* <ErrorRegister errors={errors}/> */}
        {/* Đoạn code này k cần file render chạy lỗi mà nó đã đc thay thế bởi thẻ p báo lỗi(xem ở code) */}
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              onChange={handleChangeInputs}
            />
            {/* <p style={{ ở đây là css inline cho nhanh(có nó cái dấu ngoặc nhọn là vì 1 ngoặc kép ngoài là biến, ngoặc kép thứ hai là object)
              color: "red"
            }}>&nbsp;{errors.name}</p> */}
            <p>&nbsp;{errors.name}</p>

            {/* &nbsp : cho nó hiện lỗi không bị giật (là nó sẽ tạo ra 1 khoảng trống cho thẻ p) */}
          </div>
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
          <div>
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              id="phone"
              name="phone"
              placeholder="Phone"
              onChange={handleChangeInputs}
            />
            <p>&nbsp;{errors.phone}</p>
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              onChange={handleChangeInputs}
            />
            <p>&nbsp;{errors.address}</p>
          </div>
          <div>
            <label htmlFor="avatar">Avatar:</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              placeholder="Avatar"
              onChange={handleUserInputFile}
            />
            <p>&nbsp;{errors.avatar}</p>
          </div>
          <button className="btn btn-default">Register</button>
          <br />
        </form>
      </div>
    </div>
  );
}

export default Register;
