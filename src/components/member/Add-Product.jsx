import { useEffect, useState } from "react";
import Account from "./Account";
import { api } from "../../api";
import { toast } from "react-toastify";

function AddProduct() {
  const [input, setInputs] = useState({
    name: "",
    price: "",
    category: "iphone", 
    brand: "iphone11",
    status: "1",
    sale: "",
    company: "",
    image: "",
    detail: "",
  });
  const [error, setError] = useState("")
  const [brand, setBrand] = useState([]); // vì api get về là 1 mảng nên phải khai báo nó là mảng, để "" thì nó lỗi vòng lặp map
  const [category, setCategory] = useState([]);
  const [file, setFile] = useState(""); //để luu thông tin hình ảnh để check image va size
  const [avatar, setAvatar] = useState(""); // để lưu hình ảnh mã hóa và gửi qua api

  useEffect(() =>{
    api
    .get("/category-brand")
    .then((res) => {
      // console.log(res);
      setBrand(res.data.brand)
      setCategory(res.data.category)
      // setInputs((prevState) => ({
      //   ...prevState,
      //   brand: res.data.brand,
      //   category: res.data.category,
      // })); giữ lại các value trc đó rồi set state cho brand, category
      
    })
    .catch((error) => {
      console.log(error);
    });
  },[])

  const handleChangeInputs = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) =>({ ...prevInputs, [name]: value  }));
    // nếu đang là new thì sale phải là ""
    if(name === "status" && value === "1" ){
      setInputs((prevInputs => ({...prevInputs, [name]: value, sale:""})))
    }
    
  };
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
  const handleSubmit = (e) =>{
    e.preventDefault();

    let errorSubmit = {};
    let flag = true;

    if(!input.name){
      errorSubmit.name = "Vui lòng nhập tên sản phẩm"
      flag = false
    }
    if(!input.price){
      errorSubmit.price = "Vui lòng nhập giá sản phẩm"
      flag = false
    }
    if(!input.sale){
      errorSubmit.sale = "Vui lòng nhập giá sale của sản phẩm"
      flag = false
    }
    if(!input.company){
      errorSubmit.company = "Vui lòng nhập hồ sơ sản phẩm"
      flag = false
    }
    if(!file){
      errorSubmit.image = "Vui lòng chọn ảnh sản phẩm"
      flag = false
    }
    else{
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
          input.image = avatar;
          console.log("Ảnh tải lên thành công");
          flag = true
        }
      }
    }
    // console.log({avatar});
    if(!input.detail){
      errorSubmit.detail = "Vui lòng nhập nội dung sản phẩm"
      flag = false
    }
    if(!flag){
      setError(errorSubmit)
    }else{
      setError({})

      let token = localStorage.getItem("token")
      if(token){
        token = JSON.parse(token)
      }
      // console.log(token);
      let config ={
        headers: {
          Authorization: "Bearer " + token,
          "Content-type": "application/x-www-form-urlencoded",
          Accept: 'application/json',
        },
      }
      let formData = new FormData();
      formData.append("name", input.name);
      formData.append("price", input.price);
      formData.append("category", input.category);
      formData.append("brand", input.brand);
      formData.append("company", input.company);
      formData.append("detail", input.detail);
      formData.append("status", input.status);
      formData.append("sale", input.sale);
      Object.keys(file).map((item, i)=>{
      formData.append("file[]", file[item]);
      });

      api
      .post("/user/product/add", formData, config)
      .then((response) =>{
        console.log(response);
      })
      .catch((error) =>{
        console.log(error);
      })

    }

  }
  console.log(input);
  return (
    <>
      <Account />
      <div className="col-sm-4 updateUser">
        <div className="signup-form">
          <h2>Create Product !!</h2>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div>
              <input type="text" name="name" placeholder="Name" onChange={handleChangeInputs}/>
              <p className="error-input">&nbsp;{error.name}</p>
            </div>
            <div> 
              <input type="number" name="price" placeholder="Price" onChange={handleChangeInputs} />
              <p className="error-input">&nbsp;{error.price}</p>
              </div>
            <div>
              <select name="category" id="category" onChange={handleChangeInputs} >
                {category.map(cat=>( // ngoặc tròn ở đây là return để trả về category khi map
                  <option key={cat.id}>{cat.category}</option>
                ))}
              </select>
              <p>&nbsp;</p>
              </div>
            <div>
              <select name="brand" id="brand" onChange={handleChangeInputs}>
                {brand.map(br => (
                  <option key={br.id}>{br.brand}</option>
                ))}
              </select>
              <p>&nbsp;</p>
              </div>
            <div>
              <select name="status" onChange={handleChangeInputs}>
                <option value="1">New</option>
                <option value="0">Sale</option>
              </select>
              <p>&nbsp;</p>
              </div>
            {input.status == "0" ? (
              <div className="sale-input-container">
                <input type="number" name="sale" placeholder="0" onChange={handleChangeInputs} />%
                <p className="error-input">&nbsp;{error.sale}</p>
              </div>
            )
            : (
              <></>
            )}

            <div>
              <input type="text" name="company" placeholder="Company Profile"  onChange={handleChangeInputs} />
                <p className="error-input">&nbsp;{error.company}</p>
                </div>

            <div>
              <input type="file" name="image"  onChange={handleUserInputFile} />
                <p className="error-input">&nbsp;{error.image}</p>
                </div>
            <div>
              <textarea name="detail" placeholder="Detail"  onChange={handleChangeInputs}></textarea>
                <p className="error-input">&nbsp;{error.detail}</p>
              </div>
            <button className="btn btn-default">Create</button>
            <br />
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
