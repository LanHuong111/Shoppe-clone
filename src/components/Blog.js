import { Link } from "react-router-dom";
import { api, imageUrl } from "../api";
import { useEffect, useState } from "react";

function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api
      .get("/blog")
      .then((response) => {
        console.log(response);
        setBlogs(response.data.blog.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  return (
    <div className="col-sm-9">
      <div className="blog-post-area">
        <h2 className="title text-center">Latest From our Blog</h2>
        {blogs.map((blog) => {
          return (
            <div key={blog.id} className="single-blog-post">
              {/* {console.log(blog)} */}
              <h3>{blog.title}</h3>
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
                <img src={imageUrl + blog.image} alt="" />
				{/* imageUrl được gọi ở trong file api + blog.image là lấy ảnh từ bên api về(như mấy cái blog.title ở trên) */}
              </a>
              <p>
                {blog.description}
              </p>
              <Link className="btn btn-primary" to={"/blog/detail/" + blog.id}>
                {/* chuyển hướng đến trang blog/detail cùng với id  */}
                Read More
              </Link>
            </div>
          );
        })}

        <div className="pagination-area">
          <ul className="pagination">
            <li>
              <a href="" className="active">
                1
              </a>
            </li>
            <li>
              <a href="">2</a>
            </li>
            <li>
              <a href="">3</a>
            </li>
            <li>
              <a href="">
                <i className="fa fa-angle-double-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Blog;
