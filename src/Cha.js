import { useState } from "react";
import Conn from "./Conn";

function Cha() {
  const [name, setName] = useState("");

  const handleConClick = (ten) => {
    console.log({ ten });
    setName(ten)
  };

  return (
    <>
      <Conn onConClick={handleConClick}></Conn>
      <h1>Hello {name}</h1>
    </>
  );
}

export default Cha;
