function Con(props) {
    const {age, onConClick} = props
  const name = "Huong";

  const handleClick = () => {
    onConClick(name)
  }

  return (
    <>
      <h1>{name}</h1> 
      <button onClick={handleClick}>Send</button> 
      {/* khi thẻ button đc nhấn thì hàm handleClick sẽ đc gọi */}
    </>
  );
}

export default Con;
