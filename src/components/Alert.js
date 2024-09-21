import React from "react";

function Alert(props) {
    //Capitalize first character
    const capitalize=(word)=>{
      if (word==="primary"){
        word="success"
      }
      else{
        word="error"
      }
        let lowWord=word.toLowerCase()
        return lowWord.charAt(0).toUpperCase()+lowWord.slice(1)
    }
  return (
    <div style={{height:'50px'}}>

    {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
     <strong>{capitalize(props.alert.type)}</strong> : {props.alert.msg}
      
    </div>}
    </div>
  );
}

export default Alert;
