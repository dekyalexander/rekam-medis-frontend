import React from 'react'
import Chip from '@material-ui/core/Chip';

const ApprovalTypeChip = ({approval_type_value}) => {
  let approvalType = ""  
  if(approval_type_value===1){
    approvalType = "One Level"  
  }else 
  if(approval_type_value===2){
    approvalType = "Multi Level"  
  }
  return (
        <Chip 
        size="small" 
        label={approvalType}
        color={approval_type_value===1?"primary":"secondary"} />
    );
}


export default ApprovalTypeChip;
