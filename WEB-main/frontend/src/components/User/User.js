import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "sonner";
import { MdAddCircle } from "react-icons/md";
import { FaSave } from "react-icons/fa";

import {
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
} from "../../services/UserService";

const User = () => {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    userRole: "",
    position: "",
    isActive: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Error al cargar los usuarios.");
    }
  };

  const clearForm = () => {
    setFormData({
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      userRole: "",
      position: "",
      isActive: true,
    });
    setIsEditing(false);
  };

  const validateForm = () => {
    const { firstName, lastName, email, username, userRole } = formData;

    if (!firstName || !lastName || !email || !username || !userRole) {
      toast.error("Todos los campos obligatorios deben completarse.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing && formData.userId) {
        await updateUser(formData.userId, formData);
        toast.success("Usuario actualizado correctamente.");
      } else {
        await registerUser(formData);
        toast.success("Usuario registrado correctamente.");
      }

      clearForm();
      fetchUsers();
    } catch {
      toast.error("Error al guardar el usuario.");
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    try {
      await deleteUser(userId);
      toast.success("Usuario eliminado correctamente.");
      fetchUsers();
      if (formData.userId === userId) clearForm();
    } catch {
      toast.error("Error al eliminar el usuario.");
    }
  };

  return (
    <div className="container">
      {/* Formulario */}
      <fieldset className="p-3 bg-light rounded border mb-4">
        <legend className="fw-bold">Gestión de Usuarios</legend>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label>Nombres</label>
              <input
                className="form-control"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Apellidos</label>
              <input
                className="form-control"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Email</label>
              <input
                className="form-control"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Teléfono</label>
              <input
                className="form-control"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Usuario</label>
              <input
                className="form-control"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Contraseña</label>
              <input
                className="form-control"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Rol</label>
              <select
                className="form-select"
                value={formData.userRole}
                onChange={(e) =>
                  setFormData({ ...formData, userRole: e.target.value })
                }
              >
                <option value="">[Seleccionar]</option>
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>Cargo</label>
              <input
                className="form-control"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Activo</label>
              <select
                className="form-select"
                value={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.value })
                }
              >
                <option value={true}>Sí</option>
                <option value={false}>No</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <button type="submit" className="btn btn-primary">
              {isEditing ? (
                <>
                  <FaSave className="me-2" /> Guardar cambios
                </>
              ) : (
                <>
                  <MdAddCircle className="me-2" /> Registrar
                </>
              )}
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearForm}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </fieldset>

      {/* Tabla */}
      <h4 className="mb-3 text-center">Lista de Usuarios</h4>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombres</th>
            <th>Email</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Cargo</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td>{u.userId}</td>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.userRole}</td>
              <td>{u.position}</td>
              <td>{u.isActive ? "Sí" : "No"}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(u)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(u.userId)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default User;
