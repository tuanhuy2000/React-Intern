import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { updateUser } from "../../services/UserServices";
import { toast } from "react-toastify";

const EditUser = (props) => {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const handleEditUser = async () => {
    let res = await updateUser(name, job);
    if (res && res.updatedAt) {
      props.handleEditUserModal({
        first_name: name,
        id: props.dataUserEdit.id,
      });
      toast.success("User update success");
      props.handleClose();
    } else {
      toast.error("User update fail");
    }
  };
  useEffect(() => {
    if (props.isShowModal) {
      setName(props.dataUserEdit.first_name);
    }
  }, [props.dataUserEdit]);
  return (
    <div>
      <Modal show={props.isShowModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Job</label>
                <input
                  type="text"
                  className="form-control"
                  value={job}
                  onChange={(event) => setJob(event.target.value)}
                />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleEditUser()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditUser;
