function ErrorRegister(props) {
    let error = props.errors
    function renderError(){

        if(Object.keys(error).length > 0){
            return Object.keys(error).map((key, index) =>{
                return(
                    <p key={index}>{error[key]}</p>
                )
            })
        }
    }
    return ( 
        <>
        {renderError()}
        </>
     );
}

export default ErrorRegister;