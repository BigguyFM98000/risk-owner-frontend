import { FiTrash2 } from "react-icons/fi";
import { FaPen } from "react-icons/fa";
import { IoEye } from "react-icons/io5"
import React, { useState, useEffect } from 'react';
import './App.css';
import axios from "axios";

function App() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [riskowners, setRiskowners] = useState([]);

  const [updatedName, setUpdatedName] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedRole, setUpdatedRole] = useState('');
  const [editRiskOwnerId, setEditRiskOwnerId] = useState(null);

  useEffect(() => {
    // Fetch risk owners from the backend when the component mounts
    axios.get('http://localhost:8070/riskowner')
      .then(response => setRiskowners(response.data))
      .catch(error => console.error('Error fetching risk owners:', error));
  }, [riskowners]);

  const addRiskOwner = async () => {
    try {
      const response = await axios.post('http://localhost:8070/riskowner', { name, title, email, role });
      setRiskowners([...riskowners, response.data]);
    } catch (error) {
      console.error('Error adding risk owner:', error);
    }
    setName('');
    setTitle('');
    setEmail('');
    setRole('');
  };

  const updateRiskOwner = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8070/riskowner/${id}`, { name: updatedName, title: updatedTitle, email: updatedEmail, role: updatedRole });
      const updatedRiskOwners = riskowners.map(riskowner => (riskowner._id === id ? response.data : riskowner));
      setRiskowners(updatedRiskOwners);
      setEditRiskOwnerId(null);
    } catch (error) {
      console.error('Error updating risk owner:', error);
    }
  };

  const cancelEdit = () => {
    setEditRiskOwnerId(null);
    setUpdatedName('');
    setUpdatedTitle('');
    setUpdatedEmail('');
    setUpdatedRole('');
  };

  const openEditModal = (id, name, title, email, role) => {
    setEditRiskOwnerId(id);
    setUpdatedName(name);
    setUpdatedTitle(title);
    setUpdatedEmail(email);
    setUpdatedRole(role);
    document.getElementById('my_modal_5').showModal();
  };

  const deleteRiskOwner = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/riskowner/${id}`);
      const updatedRiskOwner = riskowners.filter(riskowner => riskowner._id !== id);
      setRiskowners(updatedRiskOwner);
    } catch (error) {
      console.error('Error deleting risk owner:', error);
    }
  };

  return (
    <div className="App">
      <div className='flex flex-row justify-between p-3'>
        <h1 className='text-2xl'>Risk Owner</h1>
        <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>Add Risk Owner</button>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-md">Add Risk Owner</h3>
          <div>
            <p className="px-1">Name</p>
            <input type="text" id="name" value={name} onChange={event => setName(event.target.value)} className="input input-bordered w-full max-w-xs" />
            <p className="px-1">Title</p>
            <input type="text" id="title" value={title} onChange={event => setTitle(event.target.value)} className="input input-bordered w-full max-w-xs" />
            <p className="px-1">Email</p>
            <input type="text" id="email" value={email} onChange={event => setEmail(event.target.value)} className="input input-bordered w-full max-w-xs" />
            <p className="px-1">Role</p>
            <input type="text" id="role" value={role} onChange={event => setRole(event.target.value)} className="input input-bordered w-full max-w-xs" />
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button onClick={addRiskOwner} className="btn">Add</button>
              <button className="btn px-4 bg-red-600">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {riskowners.map(riskowner => (


              <tr key={riskowner._id}>
                <td>{riskowner.name}</td>
                <td>{riskowner.title}</td>
                <td>{riskowner.email}</td>
                <td>{riskowner.role}</td>
                <td className="flex flex-row p-4">
                  <button className="btn p-4 bg-red-600" onClick={() => deleteRiskOwner(riskowner._id)}><FiTrash2 /></button>
                  <button className="btn p-4 bg-sky-600" onClick={() => openEditModal(riskowner._id, riskowner.name, riskowner.title, riskowner.email, riskowner.role)}><FaPen /></button>
                  <button className="btn bg-green-600" onClick={() => document.getElementById('my_modal_3').showModal()}><IoEye /></button>
                </td>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Risk Owner Details</h3>
                    <div>
                      <div className="flex flex-row">
                        <h2 className="text-md">Name:</h2>
                        <label className="px-4">{riskowner.name}</label>
                      </div>
                      <div className="flex flex-row">
                        <h2 className="text-md">Title:</h2>
                        <label className="px-4">{riskowner.title}</label>
                      </div >
                      <div className="flex flex-row">
                        <h2 className="text-md">Email:</h2>
                        <label className="px-4">{riskowner.email}</label>
                      </div>
                      <div className="flex flex-row">
                        <h2 className="text-md">Role:</h2>
                        <label className="px-4">{riskowner.role}</label>
                      </div>

                    </div>
                    <p className="py-4"></p>
                  </div>
                </dialog>
              </tr>

            ))}
          </tbody>
        </table>
      </div>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div>
            <h3 className="font-bold text-lg">Edit Risk Owner!</h3>
            <div>
              <p className="px-1">Name</p>
              <input type="text" value={updatedName} onChange={event => setUpdatedName(event.target.value)} className="input input-bordered w-full max-w-xs" />
              <p className="px-1">Title</p>
              <input type="text" value={updatedTitle} onChange={event => setUpdatedTitle(event.target.value)} className="input input-bordered w-full max-w-xs" />
              <p className="px-1">Email</p>
              <input type="text" value={updatedEmail} onChange={event => setUpdatedEmail(event.target.value)} className="input input-bordered w-full max-w-xs" />
              <p className="px-1">Role</p>
              <input type="text" value={updatedRole} onChange={event => setUpdatedRole(event.target.value)} className="input input-bordered w-full max-w-xs" />
            </div>
            <div className="modal-action">
              <form method="dialog" className="p-4">
                <button className="btn p-4" onClick={() => updateRiskOwner(editRiskOwnerId)}>Edit</button>
                <button className="btn px-4 bg-red-600" onClick={cancelEdit}>Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default App;
