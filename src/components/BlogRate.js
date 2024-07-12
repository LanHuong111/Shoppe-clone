import StarRatings from "react-star-ratings";
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

function Rate(props) {
  const { setVotes } = props; 

  const [rating, setRating] = useState(0); // giá trị khởi tạo ban đầu là 0
  const params = useParams("");
  const navigate = useNavigate("");

  // console.log(params.id); // lấy params hiện tại ra, ở đây là 4

  useEffect(() => {
    api
      .get("/blog/rate/" + params.id)
      .then((res) => {
        console.log(res);
        // console.log(res.data.data);
        // console.log(Object.keys(res.data.data).length);

        // tính tổng
        if (Object.keys(res.data.data).length) {
          //  dòng if này là khi mà 1 trang sản phẩm có đánh giá thì nó mới thực hiện if
          //còn nếu k có dòng if này thì 1 trang web chưa có đánh giá gì mà tính toán như vậy thì nó sẽ bị lỗi

          const rate = res.data.data;
          let sum = 0; //dùng let khi thay đổi giá trị: vd ở đây là 0, ở dưới là số khác

          Object.keys(rate).map((key) => {
            // console.log(rate[key].rate);
            sum += rate[key].rate;
          });
          // console.log(sum);

          // tính tbc
          let lengthObj = Object.keys(rate).length; // độ dài của obj
          const averageRate = sum / lengthObj; // dùng const khi giá trị không thay đổi

          // tính tổng khi data trả về là array
          // let rate = res.data.data;
          // console.log(rate);
          // let sum = 0;
          // rate.map(item => sum += item.rate);

          // console.log(sum);

          // console.log(averageRate.toFixed(1)); // làm tròn đến 1 chữ số thập phân

          setRating(averageRate);
          setVotes(lengthObj)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function changeRating(newRating, name) {
    // console.log(newRating);
    // console.log(name);

    let token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập");
      navigate("/login");
    } else {
      token = JSON.parse(token);
    }

    //lấy auth từ localstorage ra
    let auth = localStorage.getItem("auth");
    // console.log(auth);
    if (auth) {
      auth = JSON.parse(auth);
      // console.log(auth);

      //config để gửi token qua api
      let config = {
        headers: {
          Authorization: "Bearer " + token,
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      };

      const formData = new FormData();
      formData.append("blog_id", params.id);
      formData.append("user_id", auth.id);
      formData.append("rate", newRating);
      // console.log(formData);

      api
        .post("/blog/rate/" + params.id, formData, config)
        .then((response) => {
          console.log(response);
          if (response.data.status === 200) {
            toast.success("Đánh giá sao đã được gửi ");

            api
              .get("/blog/rate/" + params.id)
              .then((res) => {
                console.log(res.data.data);
                const rate = res.data.data;
                let sum = 0;
                Object.keys(rate).map((key) => {
                  sum = sum + rate[key].rate;
                });
                const averageRate = sum / Object.keys(rate).length;
                console.log(averageRate);
                setVotes(Object.keys(rate).length)
                setRating(averageRate);
              })
              .catch((error) => {
                console.log(error);
              });
          }

          //
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // console.log("đánh giá mới cho" ,{rating}, "và", {name}) ;
  }

  return (
    <StarRatings
      rating={rating} //trạng thái đánh giá hiện tại
      starRatedColor="blue" //màu của sao đã của đánh giá
      changeRating={changeRating} // hàm xử lí khi ng dùng bấm đánh giá
      numberOfStars={5} // tổng sao hiện tại
      name="rating" // tên đánh giá
    />
  );
}
export default Rate;
