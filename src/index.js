import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Blog from "./components/Blog"
import BlogDetail from './components/BlogDetail';
import Login from './components/member/Login';
import Register from './components/member/Register';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <Router>
      <App>
        <Routes>
          <Route path='/blog/list' element={<Blog/>}/>
          <Route path='/blog/detail/:id' element={<BlogDetail/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
        <ToastContainer />
        {/* có 3 màu 
        toast.warning vàng(lỗi bth)
        toast.error đỏ (Lỗi nghiêm trọng)
        toast.success xanh (Thành cồn) */}
      </App>
      </Router>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


//cách 2 của file app - cái này là bỏ leftbar ở chỗ blog/detail
//bỏ code này qua đây vì code nó khác
// function App(props) {
//   const location = useLocation();


//   const notHasLeftBar =
//     location.pathname.includes("login") ||
//     location.pathname.includes("blog/detail");

//   return (
//     <>
//       <Header />
//       <section>
//         <div className="container">
//           <div className="row">
//             {notHasLeftBar ? (
//               <></>
//             ) : (
//               <MenuLeft />
//             )}
//             {/* includes( kiểm tra cái mảng đó có tồn tại cái mảng hay k),  nó sẽ kiểm tra xem pathname sẽ lấy cái path sau url, ở đây là login */}
//             {props.children}
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// }