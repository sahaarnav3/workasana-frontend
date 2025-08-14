export default function CreateNewProjectModal({ closeModal }) {
  return (
    <div className="modalOverlay">
      <div className="newProjectModal px-4 pt-3">
        <div className="d-flex justify-content-between align-items-center border-bottom">
          <h3>Create New Project</h3>
          <img
            src="https://www.svgrepo.com/show/509072/cross.svg"
            alt="Cross SVG File"
            width="35"
            height="35"
            onClick={closeModal}
          />
        </div>
        <div className="border-bottom pb-4">
          <label className="form-label mt-4 fs-5">Project Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Project Name"
          />
          <label className="form-label mt-4 fs-5">Project Description</label>
          <textarea
            className="form-control"
            placeholder="Enter Project Description"
            rows="3"
          />
        </div>
        <div className="my-3 d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn btn-primary">Create</button>
        </div>
      </div>
    </div>
  );
}
