import { useEffect, useState } from "react";
import { Social } from "../images";
import { api, imageUrl } from "../api";
import { useParams } from "react-router-dom";
import BlogCommend from "./BlogCommend";

function BlogDetail() { 
  const params = useParams(""); // param để lấy id
  const [blogsDetail, setBlogsDetail] = useState({});
  const [comment, setComment] = useState([])
  // console.log(setComment);
  useEffect(() => {
    api
      .get("/blog/detail/" + params.id)
      .then((response) => {
        // console.log(response);
        setBlogsDetail(response.data.data);
        setComment(response.data.data.comment) // set comment để truyền props qua blogcomment
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // console.log(blogsDetail);

  // console.log(comment);

  return (
    <div className="col-sm-9">
      <div className="blog-post-area">
        <h2 className="title text-center">Latest From our Blog</h2>
        <div className="single-blog-post">
          <h3>{blogsDetail.title}</h3>
          <div className="post-meta">
            <ul>
              <li>
                <i className="fa fa-user"></i> Mac Doe
              </li>
              <li>
                <i className="fa fa-clock-o"></i> 1:33 pm
              </li>
              <li>
                <i className="fa fa-calendar"></i> DEC 5, 2013
              </li>
            </ul>
            <span>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star-half-o"></i>
            </span>
          </div>
          <a href="">
            <img src={imageUrl + blogsDetail.image} alt="" />
          </a>
          <p>{blogsDetail.description}</p>
          {/* <div
            dangerouslySetInnerHTML={{
              __html: blogsDetail.content,
            }}
          ></div> */}
          <p>{blogsDetail.content}</p> 
          {/* đoạn comment ở trên là để cho get api về là nó sẽ xóa mất cái thẻ h1 hay thẻ p khii get api về nó hiển thị ra như thế (nsó nguy hiểm nên ít dùng và bất khả kháng mới dùng) */}
          <div className="pager-area">
            <ul className="pager pull-right">
              <li>
                <a href="#">Pre</a>
              </li>
              <li>
                <a href="#">Next</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rating-area">
        <ul className="ratings">
          <li className="rate-this">Rate this item:</li>
          <li>
            <i className="fa fa-star color"></i>
            <i className="fa fa-star color"></i>
            <i className="fa fa-star color"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
          </li>
          <li className="color">(6 votes)</li>
        </ul>
        <ul className="tag">
          <li>TAG:</li>
          <li>
            <a className="color" href="">
              Pink <span>/</span>
            </a>
          </li>
          <li>
            <a className="color" href="">
              T-Shirt <span>/</span>
            </a>
          </li>
          <li>
            <a className="color" href="">
              Girls
            </a>
          </li>
        </ul>
      </div>

      <div className="socials-share">
        <a href="">
          <img src={Social} alt="" />
        </a>
      </div>

     
      <BlogCommend comments={comment} setComments={setComment}/>
    </div>
  );
}

export default BlogDetail;
