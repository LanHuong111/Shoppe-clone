import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
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

  // console.log(comments);

  // c1

  // let parentComments = [];

  // comments.map((comment, index) => {
  //   if (comment.id_comment === 0) {
  //     parentComments.push(comment);
  //   }
  // });
  // console.log(parentComments);

  // c2 
  // filter: Lọc mảng // lặp

  // const parentCommentsFilter = comments.filter((comment) => {
  //   if (comment.id_comment === 0) {
  //     return comment;
  //   }
  // });

  // console.log({parentCommentsFilter});

  // c3 
    // filter: Lọc mảng vừa lặp mảng ; filter là phương thức của javascript
  const parentCommentsFilter = comments.filter(
    (comment) => comment.id_comment === 0 
    // ngoặc tròn comment( là cái biến con của comments) là nó sẽ thay thế cho từ return vì ở đây là arrowFunction,
    //  nó sẽ trả ra kết quả cho biến đc gán rút gọn code lại cho code clean luôn
  );

  // console.log({ parentCommentsFilter });
  const childrenCommentFilter = comments.filter(
    (comment) =>comment.id_comment != 0
  )
  // console.log({childrenCommentFilter});


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
                  setComments(response.data.data.comment); //set lại comment để nó tự lên cmt không cần phải chạy lại trang
                  setComment("")
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
    toast.success(idComment);
    // console.log(idComment);
    setIdComment(idComment); //lấy id cha làm idcomment của thg con, còn idcomment cha là 0 
    //lấy idcomment cha ra r set vô setIdComment để cho idcomment hiện tại k phải là 0 thì idcomment hiện tại đag đc gắn là id của cha thì nó sẽ là idcomment con
    inputRef.current.focus(); // hàm này để khi kick thẻ đag gắn sự kiện onClick thì nó sẽ đc chuyển tới thẻ đag đc chọn để chọt
    //hay còn gọi là focus vào textarea
  };
  

  return (
    <div>
      <div className="response-area">
        <h2>Tất cả bình luận</h2>
        <ul className="media-list">
          {sortBy(parentCommentsFilter, "id").map((parentComments) => {
            const commentDate = new Date(Date.parse(parentComments.created_at));
            const formattedDate = commentDate.toISOString().split("T")[0]; 
            const formattedTime = commentDate.toLocaleTimeString();

            return (
             <div key={parentComments.id}>
                <li  className="media" key={parentComments.id}>
                  <a className="pull-left" href="#">
                    <img
                      style={{
                        width: 100,
                        height: 100,
                      }}
                      className="media-object"
                      src={imageUserUrl + parentComments.image_user}
                      alt=""
                    />
                  </a>
                  <div className="media-body">
                    <ul className="sinlge-post-meta">
                      <li>
                        <i className="fa fa-user"></i>
                        {parentComments.name_user}
                      </li>
                      <li>
                        <i className="fa fa-clock-o"></i> {formattedTime}
                      </li>
                      <li>
                        {/* <i className="fa fa-calendar"></i> {new Date(Date.parse(parentComments.created_at)).toISOString().split('T')[0]} */}
                        <i className="fa fa-calendar"></i> {formattedDate}
                      </li>
                    </ul>
                    <span>{parentComments.comment}</span>
                    <p  className="replycmt" onClick={() => handleClickReplay(parentComments.id)}>
                      {/* gọi hàm callback để lấy đc id cha ra*/}
                      <i className="fa fa-reply"></i>Replay
                    </p>
                  </div>
                </li>
              {sortBy(childrenCommentFilter, "id").map((childrenComment) =>{
                const commentDate = new Date(Date.parse(childrenComment.created_at));
                const formattedDate = commentDate.toISOString().split("T")[0];
                const formattedTime = commentDate.toLocaleTimeString();

                if(childrenComment.id_comment === parentComments.id){
                   return(
                  <li className="media second-media" key={childrenComment.id}>
                  <a className="pull-left" href="#">
                    <img
                      style={{
                        width: 100,
                        height: 100,
                      }}
                      className="media-object"
                      src={imageUserUrl + childrenComment.image_user}
                      alt=""
                    />
                  </a>
                  <div className="media-body">
                    <ul className="sinlge-post-meta">
                      <li>
                        <i className="fa fa-user"></i>
                        {childrenComment.name_user}
                      </li>
                      <li>
                        <i className="fa fa-clock-o"></i> {formattedTime}
                      </li>
                      <li>
                        <i className="fa fa-calendar"></i> {formattedDate}
                      </li>
                    </ul>
                    <span> <strong>{parentComments.name_user}</strong> {childrenComment.comment}</span>
                    <p className="replycmt" onClick={() => handleClickReplay(parentComments.id)}>
                      {/* khi bấm vô reply trả lời comment con thì mình phải lấy id comment cha ra  */}
                      <i className="fa fa-reply"></i>Replay
                    </p>
                  </div>
                </li>
                )
                }
               
              })}
             </div>
            );
          })}
          {/* {console.log(childrenCommentFilter)} */}
          {/* {console.log(parentCommentsFilter)} */}
          {/*  */}
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
             
             {idComment ? <button onClick={() => {
                setIdComment(0);
              }}>Close reply</button> : <></>}
              {/* idComment hiện tại ở đây là idcomment con (#0), nếu #0 thì nó sẽ hiện nút button () gắn sự kiện onClick setIdComment lại là 0 */}
              {/* nếu idComment hiện tại là 0 thì nút button k đc hiển thị ra */}
              <textarea
                ref={inputRef} //hàm ref này đã đc khai báo ở trên, để nó đc chọt tới ô textarea
                name="message"
                rows="11"
                value={comment}
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
