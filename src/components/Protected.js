import useAuth from "src/hooks/useAuth";
import React,{useEffect} from "react";
import useUi from "src/hooks/useUi";

const Protected = (props) => { 
	const { children, allowedCodes=[], ownerOnly, ownerId } = props
	const {user} = useAuth()
	const {menuActions=[]} = useUi()
	let granted = false   
  
	if(user && ownerOnly){
		if(user.id===ownerId){
			granted = true
		}
	}	  

	menuActions.map(action=>(action.code)).forEach(cur => {
		if (allowedCodes.includes(cur)) {
			granted = true;
		}
	});	

	if (granted === true) {
		return <>{children}</>
	}
	else{
		return null
	}
};

export default Protected;
