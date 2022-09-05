import { filter } from "lodash";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// material
import { useTheme } from "@material-ui/core/styles";
import {
  Box,
  Card,
  Table,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Button,
  Grid,
  Typography,
  TableContainer,
  Dialog,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Input,
} from "@material-ui/core";

import { MButton } from "../../components/@material-extend";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import MenuListHead from "./MenuListHead";
import Conditional from "../../components/Conditional";
import ActionDetail from "../action/ActionDetail";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import Protected from "src/components/Protected";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "code", label: "Code", alignRight: false },
  { id: "need_approval", label: "Approval", alignRight: false },
  { id: "approval_type", label: "Approval Type", alignRight: false },
];

// ---------------------------------------------------------------------

export default function MenuAction(props) {
  const { row, submitSuccess, submitError, closeMainDialog } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = useState("asc");
  const [dataTable, setdataTable] = useState([]);
  const [selectedIds, setselectedIds] = useState([]);
  const [newActions, setnewActions] = useState([]);
  const [actionOptions, setactionOptions] = useState([]);
  const [openSubDialog, setopenSubDialog] = useState(false);
  const [selectAction, setselectAction] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [actionCode, setactionCode] = useState("READ");

  const getMenuActionData = async () => {
    const params = {
      menu_id: row.id,
    };
    const response = await axios.get(endpoint.action.root, { params: params });
    if (response && response.data) {
      setdataTable(response.data);
    }
  };

  const getactionOptions = async () => {
    const params = {
      not_menu_id: row.id,
    };
    const response = await axios.get(endpoint.action.option, {
      params: params,
    });
    if (response && response.data) {
      setactionOptions(response.data);
    }
  };

  const closeSubDialog = () => {
    setopenSubDialog(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataTable.map((n) => n.id);
      setselectedIds(newSelecteds);
      return;
    }
    setselectedIds([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    setselectedIds(newSelected);
  };

  const showDeleteConfirmation = () => {
    setMaxWidth("sm");
    setdialogContent(
      <DeleteConfirmation
        handleClose={closeSubDialog}
        handleDelete={handleDelete}
        selectedIds={selectedIds}
        title="Action"
      />
    );
    setopenSubDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      action_ids: selectedIds,
    };
    const response = await axios.delete(endpoint.menu.action, {
      data: params,
    });
    if (response) {
      submitSuccess("delete data success");
      getMenuActionData();
    }
    setselectedIds([]);
  };

  const showActionForm = () => {
    setMaxWidth("md");
    setdialogContent(
      <ActionDetail
        actionCode="CREATE"
        closeSubDialog={closeSubDialog}
        menu_id={row.id}
        application_id={row.application_id}
        getMenuActionData={getMenuActionData}
        submitSuccess={submitSuccess}
      />
    );
    setopenSubDialog(true);
  };

  const showSelectAction = () => {
    setselectAction(true);
  };

  const addAction = async () => {
    const params = {
      menu_id: row.id,
      action_ids: newActions,
    };
    await axios.patch(endpoint.action, params);
    getactionOptions();
    getMenuActionData();
    setselectAction(false);
  };

  const selectNewAction = (e) => {
    setnewActions(e.target.value);
  };

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if (row) {
      getactionOptions();
      getMenuActionData();
    }
  }, [row]);

  return (
    <>
      <Container>
        <Grid container style={{ marginBottom: 16 }}>
          <Grid container justifyContent="flex-end" alignItems="center">
            <Conditional condition={selectedIds.length > 0}>
              <Protected allowedCodes={["EDIT"]}>
                <MButton
                  variant="contained"
                  color="error"
                  style={{ margin: "0 8px" }}
                  onClick={showDeleteConfirmation}
                >
                  Delete
                </MButton>
              </Protected>
            </Conditional>

            <Protected allowedCodes={["EDIT"]}>
              <MButton
                variant="contained"
                color="secondary"
                style={{ margin: "0 8px" }}
                onClick={showActionForm}
              >
                Create Action
              </MButton>
            </Protected>
          </Grid>
        </Grid>

        <Card style={{ marginBottom: 16 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <MenuListHead
                  order={order}
                  headLabel={TABLE_HEAD}
                  rowCount={dataTable.length}
                  numSelected={selectedIds.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {dataTable.map((row) => {
                    const {
                      id,
                      name,
                      code,
                      is_need_approval,
                      approval_type,
                    } = row;
                    const isItemSelected = selectedIds.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selectedIds={isItemSelected}
                        aria-checked={isItemSelected}
                        onClick={(event) => handleClick(event, id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Box
                            sx={{
                              py: 2,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {name}
                          </Box>
                        </TableCell>
                        <TableCell align="left">{code}</TableCell>
                        <TableCell align="left">{is_need_approval}</TableCell>
                        <TableCell align="left">{approval_type}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>

        <Grid container>
          <Grid item xs={6} container justifyContent="flex-start"></Grid>

          <Grid item xs={6} container justifyContent="flex-end">
            {props.closeSubDialog && (
              <Button
                variant="contained"
                onClick={props.closeSubDialog}
                color="inherit"
              >
                close
              </Button>
            )}

            {closeMainDialog && (
              <Button
                variant="contained"
                onClick={closeMainDialog}
                color="inherit"
              >
                close
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={openSubDialog}
        maxWidth={maxWidth}
        onClose={closeSubDialog}
        fullWidth
        scroll="body" 
      >
        {dialogContent}
      </Dialog>
    </>
  );
}
