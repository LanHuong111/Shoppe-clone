import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api, imageUserUrl } from "../api";
import { sortBy } from "lodash";

function BlogCommend(props) {
  // console.log(props);
  let comments = props.comments;
  let setComments = props.setComments;
  // console.log(setComments);

  const [idComment, setIdComment] = useState(0);
  const [comment, setComment] = useState("");
  const params = useParams("");
  const navigate = useNavigate("");
  const inputRef = useRef(); // hàm này là để chọt vô 1 thẻ (ở đây là click vô replay nhảy sang comment) nhưng thẻ đó đã đc render ra rồi mới chọt tới đc

  // console.log(params.id);
  // console.log(idComment);
  console.log(comments);

    comments.map((comment, index) =>{
      if(comment.id_comment === 0){
        console.log(comment);
        // setCommentFather(comment)
      }
    })
  const handlePostComment = (e) => {
    e.preventDefault();

    let token = localStorage.getItem("token");
    // console.log(token);

    if (!token) {
      toast.error("Vui lòng đăng nhập");
      navigate("/login");
    } else {
      // ở đây chuyển đổi lại cho token k phải dạng chuỗi
      //đổi ở trong này bởi vì thì else của if(!token) cx như  if(token)
      token = JSON.parse(token); //chú ý
      if (!comment) {
        toast.error("Vui lòng nhập comment!");
      }
    }

    //const k gán lại dc giá trị, chỉ có let
    let auth = localStorage.getItem("auth");
    if (auth) {
      auth = JSON.parse(auth);
      // console.log(auth);

      //config để gửi token qua api, phải có cái này vì nó như cái chìa khóa để gửi comment lên
      let config = {
        headers: {
          Authorization: "Bearer " + token,
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      };

      //kiểm tra đã nhập chưa
      if (comment) {
        const formData = new FormData();
        formData.append("id_blog", params.id);
        formData.append("id_user", auth.id);
        formData.append("id_comment", idComment);
        formData.append("comment", comment);
        formData.append("image_user", auth.avatar);
        formData.append("name_user", auth.name);
        //gửi lên api

        

        api
          .post("/blog/comment/" + params.id, formData, config)
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              toast.success("Bình luận đã được gửi!");
              api
                .get("/blog/detail/" + params.id)
                .then((response) => {
                  console.log(response.data.data.comment);
                  setComments(response.data.data.comment);
                })
                .catch((error) => console.log(error));
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error("Gửi bình luận thất bại, vui lòng thử lại!!!");
          });
      }
    }
  };

  const handleChangeComment = (event) => {
    const { value } = event.target;
    // console.log(value);
    setComment(value);
  };
  const handleClickReplay = (idComment) => {
    //idComment ở đây bản chất nó như event nhưng mik đặt tên gọi thế cho nó dễ phân biệt
    // toast.success(idComment);
    console.log(idComment);
    setIdComment(idComment)
    inputRef.current.focus() // hàm này để khi kick thẻ đag gắn sự kiện onClick thì nó sẽ đc chuyển tới thẻ đag đc chọn để chọt
    //hay còn gọi là focus vào textarea
  };

  return (
    <div>
      <div className="response-area">
        <h2>Tất cả bình luận</h2>
        <ul className="media-list">
          {/* sortBy là để sắp xếp thứ tự của api (hiểu kiểu thế) */}
          {sortBy(comments, "id").map((comment) => {
            // "id" ở đây là nó sẽ sắp xếp theo thứ tự id nhỏ đến lớn, cách khác lấy "comment" ra nó sẽ sắp xếp theo chữ cái a- z
            {
              /* {comments.map((comment) => { */
            }
            const commentDate = new Date(Date.parse(comment.created_at));
            const formattedDate = commentDate.toISOString().split("T")[0]; // Định dạng ngày "YYYY-MM-DD"
            const formattedTime = commentDate.toLocaleTimeString(); // Định dạng giờ theo hệ thống cài đặt

            return (
              <li className="media" key={comment.id}>
                <a className="pull-left" href="#">
                  <img
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    className="media-object"
                    src={imageUserUrl + comment.image_user}
                    alt=""
                  />
                </a>
                <div className="media-body">
                  <ul className="sinlge-post-meta">
                    <li>
                      <i className="fa fa-user"></i>
                      {comment.name_user}
                    </li>
                    <li>
                      <i className="fa fa-clock-o"></i> {formattedTime}
                    </li>
                    <li>
                      {/* <i className="fa fa-calendar"></i> {new Date(Date.parse(comment.created_at)).toISOString().split('T')[0]} */}
                      <i className="fa fa-calendar"></i> {formattedDate}
                    </li>
                  </ul>
                  <p>{comment.comment}</p>
                  <p onClick={() => handleClickReplay(comment.id)}>
                    {/* gọi hàm callback để lấy đc id comment.id */}
                    <i className="fa fa-reply"></i>Replay
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="replay-box">
        <div className="row">
          <div className="col-sm-12">
            <h2>Hãy để lại 1 bình luận của bạn</h2>

            <div className="text-area">
              <div className="blank-arrow">
                <label>Your Name</label>
              </div>
              <span>*</span>
              <textarea
                ref={inputRef}  //hàm ref này đã đc khai báo ở trên, để nó đc chọt tới ô textarea
                name="message"
                rows="11"
                onChange={handleChangeComment}
              ></textarea>
              <a
                className="btn btn-primary"
                href=""
                onClick={handlePostComment}
              >
                post comment
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCommend;
