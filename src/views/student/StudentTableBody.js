// material
import {
  Box,
  Card,
  Table,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell
} from '@material-ui/core';
// components
import ClickableText from '../../components/ClickableText';

// ----------------------------------------------------------------------


export default function StudentTableBody(props) {
  const {dataTable=[], selectedIds=[], handleClick, showDialog} = props
  return (
    <TableBody>
        {dataTable.map((row) => {
            const { id, name, niy, jenjang={}, kelas={} } = row;
            const isItemSelected = selectedIds.indexOf(id) !== -1;

            return (
              <TableRow
                hover
                key={id}
                tabIndex={-1}
                role="checkbox"
                selected={isItemSelected}
                aria-checked={isItemSelected}
                onClick={(event) => handleClick(event, id, row)}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={isItemSelected} />
                </TableCell>
                <TableCell component="th" scope="row" padding="none">
                  <Box
                    sx={{
                      py: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ClickableText
                      variant="subtitle2"
                      onClick={() => showDialog('READ', row)}
                      text={name}
                    />
                  </Box>
                </TableCell>  
                <TableCell>
                  {niy}
                </TableCell>                        
                <TableCell>
                  {jenjang.name}
                </TableCell>                        
                <TableCell>
                  {kelas.name}
                </TableCell>                                        
              </TableRow>
            );
          })}
        
      </TableBody>
  );
}
