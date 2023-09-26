import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { fetchAllUser } from "../../services/UserServices";
import ReactPaginate from "react-paginate";
import AddNew from "../AddNew/AddNew";
import EditUser from "../EditUser/EditUser";
import _, { debounce } from "lodash";
import DeleteUser from "../DeleteUser/DeleteUser";
import "./TableUser.scss";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

const TableUsers = (props) => {
  useEffect(() => {
    getUsers(1);
  }, []);

  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});
  const [dataUserDelete, setDataUserDelete] = useState({});
  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setTotalUsers(res.total);
      setTotalPages(res.total_pages);
      setListUsers(res.data);
    }
  };

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  const handleClose = () => {
    setIsShowModal(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };

  const handleEditUser = (user) => {
    setIsShowModalEdit(true);
    setDataUserEdit(user);
  };
  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
  };

  const handleEditUserModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUser[index].first_name = user.first_name;
    setListUsers(cloneListUser);
  };

  const handleDeleteUserModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers);
    cloneListUser = listUsers.filter((item) => item.id !== user.id);
    setListUsers(cloneListUser);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUser = _.cloneDeep(listUsers);
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
    setListUsers(cloneListUser);
  };

  const handleSearch = debounce((event) => {
    //setKeyWord(event.target.value);
    let tmp = event.target.value;
    if (tmp) {
      let cloneListUser = _.cloneDeep(listUsers);
      cloneListUser = cloneListUser.filter((item) => item.email.includes(tmp));
      setListUsers(cloneListUser);
    } else {
      getUsers(1);
    }
  }, 1000);

  const handleImportUsers = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("only csv file");
        return;
      }
      Papa.parse(file, {
        //header: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 5) {
              if (
                rawCSV[0][1] !== "email" ||
                rawCSV[0][2] !== "first_name" ||
                rawCSV[0][3] !== "last_name"
              ) {
                toast.error("wrong format");
              } else {
                let result = [];
                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 5) {
                    let obj = {};
                    obj.email = item[1];
                    obj.first_name = item[2];
                    obj.last_name = item[3];
                    result.push(obj);
                  }
                });
                setListUsers(result);
                console.log(result);
                toast.success("ok");
              }
            } else toast.error("wrong format");
          } else toast.error("unknow data");
        },
      });
    }
  };

  return (
    <>
      <div className="my-3 d-sm-flex justify-content-between">
        <span>
          <h3>List user</h3>
        </span>
        <div className="group-btn">
          <label htmlFor="test" className="btn btn-warning">
            <i className="fa-solid fa-file-import"></i>
            Import
          </label>
          <input
            type="file"
            id="test"
            hidden
            onChange={(event) => handleImportUsers(event)}
          />
          <CSVLink
            filename={"my-file.csv"}
            className="btn btn-success"
            data={listUsers}
          >
            <i className="fa-solid fa-file-arrow-down"></i>
            Export
          </CSVLink>
          <button
            className="btn btn-primary"
            onClick={() => setIsShowModal(true)}
          >
            <i className="fa-solid fa-circle-plus"></i>
            Add new user
          </button>
        </div>
      </div>
      <div className="col-12 col-sm-4 my-3">
        <input
          className="form-control"
          placeholder="search here"
          //value={keyWord}
          onChange={(event) => handleSearch(event)}
        />
      </div>
      <div className="custom-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <div className="sort-header">
                  <span>ID</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleSort("desc", "id")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleSort("asc", "id")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>Email</th>
              <th>
                <div className="sort-header">
                  <span>First name</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleSort("desc", "first_name")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleSort("asc", "first_name")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listUsers &&
              listUsers.length > 0 &&
              listUsers.map((item, index) => {
                return (
                  <tr key={`users-${index}`}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>
                      <button
                        className="btn btn-warning mx-3"
                        onClick={() => handleEditUser(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <AddNew
        isShowModal={isShowModal}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />
      <EditUser
        isShowModal={isShowModalEdit}
        handleClose={handleClose}
        dataUserEdit={dataUserEdit}
        handleEditUserModal={handleEditUserModal}
      />
      <DeleteUser
        isShowModal={isShowModalDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserModal={handleDeleteUserModal}
      />
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
    </>
  );
};

export default TableUsers;
