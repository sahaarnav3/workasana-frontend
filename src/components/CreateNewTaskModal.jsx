import Select from "react-select";

export default function CreateNewTaskModal({ closeModal }) {
    
    return(
        <div className="modalOverlay">
          <div className="newProjectModal px-4 pt-3">
            <div className="d-flex justify-content-between align-items-center border-bottom">
              <h3>Create New Task</h3>
              <img
                src="https://www.svgrepo.com/show/509072/cross.svg"
                alt="Cross SVG File"
                width="35"
                height="35"
                onClick={closeModal}
              />
            </div>
            <div className="border-bottom pb-4">
              <label className="form-label mt-4 fs-5">Select Project</label>
              <select className="form-select">
                <option value="">Dropdown</option>
              </select>
              <label className="form-label mt-4 fs-5">Task Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Task Name"
              />
              <label className="form-label mt-4 fs-5">Select Team</label>
              <select className="form-select">
                <option value="">Dropdown</option>
              </select>
              <label className="form-label mt-4 fs-5">Select Owners</label>
              <Select
                isMulti
                options={[
                  { value: "0", label: "Angular" },
                  { value: "1", label: "Bootstrap" },
                  { value: "2", label: "React.js" },
                  { value: "3", label: "Vue.js" },
                ]}
                placeholder="Select Owner(s)"
                // value={selectedOwners}
                // onChange={setSelectedOwners}
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
    )
}