import "./App.css";
import Header from "./Header";
import MenuLeft from "./MenuLeft";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

function App(props) {
  const notHasLeftBar = [ "/login", "/register", "/user/update", "/user/my-product","/user/product/add"];
  const location = useLocation()

  // console.log({Hehe: notHasLeftBar.includes(location.pathname)});
  //  text xem nó true hay false


  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="row">
          {notHasLeftBar.includes(location.pathname) ? <></> : <MenuLeft />}
          {/* includes( kiểm tra cái mảng đó có tồn tại cái mảng hay k),  nó sẽ kiểm tra xem pathname sẽ lấy cái path sau url, ở đây là login */}
            {props.children}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default App;
