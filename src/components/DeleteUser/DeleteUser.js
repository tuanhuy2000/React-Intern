import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteUser } from "../../services/UserServices";

const DeleteUser = (props) => {
  const handleDeleteUser = async () => {
    let res = await deleteUser(props.dataUserDelete.id);
    if (res && +res.statusCode === 204) {
      props.handleDeleteUserModal(props.dataUserDelete);
      toast.success("Delete user success");
      props.handleClose();
    } else {
      toast.error("delete user fail");
    }
  };

  return (
    <div>
      <Modal show={props.isShowModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            You want to delete user <b>{props.dataUserDelete.first_name}</b> ???
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleDeleteUser()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteUser;
