import React from 'react'
import Chip from '@material-ui/core/Chip';

const StatusChip = ({status}) => {
  let label = ''  
  let color = ''  
  if(status===1){
    label = 'Active' 
    color =  'primary'
  }else 
  if(status===0){
    label = 'Inactive'  
    color =  'default'
  }
  return (
        <Chip 
        size='small' 
        label={label}
        color={color} />
    );
}


export default StatusChip;
