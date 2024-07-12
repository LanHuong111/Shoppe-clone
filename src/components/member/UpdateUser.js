import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api";
import Account from "./Account";

function UpdateUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [error, setError] = useState({});
  const [file, setFile] = useState(""); // lưu hình ảnh mã hóa và gửi qua api
  const [avatar, setAvatar] = useState(""); // thông tin hình ảnh (size và imgae)
  const navigate = useNavigate("");

  //giải thích luồng chạy tại sao file là phải base 64, dữ liệu đó base64 ở đâu ra tại k thấy nó dính líu gì đến avatar
  // sao check đủ điều kiện avatar đúng thì nó lại lưu vào file
  useEffect(() => {
    let token = localStorage.getItem("token");
    // console.log(token);

    if (!token) {
      toast.error("Vui lòng đăng nhập");
      navigate("/login");
    } else {
      let userData = localStorage.getItem("auth");
      if (userData) {
        userData = JSON.parse(userData);
        // console.log(userData);
        setUser({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          avatar: userData.avatar,
        });
        // console.log(userData.name);
      }
    }
  }, []);
  

  const handleChangeInputs = (event) => {
    // console.log(event.target.value);
    const { name, value } = event.target;
    setUser((prevInputs) => ({ ...prevInputs, [name]: value }));
  };
  const handleInputAvatar = (e) => {
    const avatar = e.target.files[0]; // thông tin hình ảnh
    console.log(avatar);
    let reader = new FileReader();
    reader.onload = (e) => {
      // console.log(e);
      // console.log(e.target.result);
      setFile(e.target.result); // cái này để gửi api (base 64)
      setAvatar(avatar); //cái này để lưu toàn bộ thông tin file upload
    };
    reader.readAsDataURL(avatar);
  };
  // console.log({avatar});
  //  xem avatar đã thành chuỗi base64 hay chưa

  function handleSubmit(e) {
    e.preventDefault();

    let errorsSubmit = {};
    let flag = true;

    // console.log(user);
    // console.log(avatar);

    if (!user.name) {
      errorsSubmit.name = " Vui lòng nhập tên";
      flag = false;
    }
    if (!user.phone) {
      errorsSubmit.phone = " Vui lòng nhập số điện thoại";
      flag = false;
    }
    if (!user.address) {
      errorsSubmit.address = " Vui lòng nhập địa chỉ";
      flag = false;
    }
    if (avatar) {
      const type = avatar.type;
      const size = avatar.size;
      if (!type.includes("image")) {
        toast.error("Vui lòng chọn hình ảnh");
        flag = false;
      } else {
        if (size > 1024 * 1024) {
          toast.warning("File tải lên quá lớn");
          flag = false;
        } else {
          // console.log(file);
          user.avatar = file; // ảnh đã đủ điều kiện thì cho bằng file
          console.log("Ảnh tải lên thành công");
        }
      }
    } 
    let userData = localStorage.getItem("auth");
    if (userData) {
      userData = JSON.parse(userData);
    }
    let token = localStorage.getItem("token");
    if(token){
      token =JSON.parse(token)
    }
    let config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    };
    console.log(token);
    if (!flag) {
      setError(errorsSubmit);
    } else {
      setError({});
      api
        .post("/user/update/" + userData.id, user, config)
        .then((response) => {
          console.log(response);

          let token = response.data.token
          let auth = response.data.Auth
          // console.log(token, auth);

          if(response.status === 200){
            console.log(user);
            let Token = JSON.stringify(token)
            localStorage.setItem("token", Token)
            let Auth = JSON.stringify(auth)
            localStorage.setItem("auth", Auth)
            toast.success("Update User thành công")
            navigate("/")
          }

        })

        .catch((error) => {
          console.log(error);
        });
    }
  }
  console.log(user);

  return (
    <>
      <section>
       <Account/>
        <div className="col-sm-4 updateUser">
          <div className="signup-form">
            <h2>Update User !!</h2>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={user.name}
                  onChange={handleChangeInputs}
                />
                <p className="error">&nbsp;{error.name}</p>
              </div>
              {/* <div> đoạn code ở đây là dùng defaulValue là nó cx hiển thị dữ liệu lên màn hình nhưng phải có thêm value để nó change lại khi ng dùng thay đổi
              hàm onBlur là để khi bấm xg dữ liệu bấm ra ngoài là nó set value là cái đag bấm
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  defaultValue={user.name}
                  value={user.name}
                  onChange={handleChangeInputs}
                  onBlur={handleChangeInputs}
                  
                />
                <p className="error">&nbsp;{error.name}</p>
              </div> */}
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  readOnly
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  value={user.email}
                  onChange={handleChangeInputs}
                />
                <p className="error">&nbsp;{error.email}</p>
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
                <p className="error">&nbsp;</p>
              </div>
              <div>
                <label htmlFor="phone">Phone:</label>
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  placeholder="Phone"
                  value={user.phone}
                  onChange={handleChangeInputs}
                />
                <p className="error">&nbsp;{error.phone}</p>
              </div>
              <div>
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={user.address}
                  onChange={handleChangeInputs}
                />
                <p className="error">&nbsp;{error.address}</p>
              </div>
              <div>
                <label htmlFor="avatar">Avatar:</label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  placeholder="Avatar"
                  onChange={handleInputAvatar}
                />
                <p>&nbsp;</p>
              </div>
              <button className="btn btn-default">Update</button>
              <br />
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default UpdateUser;


