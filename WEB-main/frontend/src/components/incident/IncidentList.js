import { useEffect, useState } from "react";
import { getAllIncidents, deleteIncident } from "../../services/incidentService";
import { filterIncidents } from "../../services/incidentService";

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Box, Typography, Alert, CircularProgress,
  TextField, Select, MenuItem, FormControl, InputLabel, Grid, Button
} from '@mui/material';

import { Edit, Delete, Warning, CheckCircle, Info } from '@mui/icons-material';

export default function IncidentList({ onEditar }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // === NUEVO === Estado de filtros
  const [filtros, setFiltros] = useState({
    area: "",
    priorityLevel: "",
    registeredUser: ""
  });

  // === NUEVO === Función para aplicar filtro
  const aplicarFiltro = async () => {
    try {
      setLoading(true);
      const data = await filterIncidents(filtros);
      setIncidents(data);
    } catch (err) {
      setError("Error al filtrar incidentes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarIncidentes = async () => {
    try {
      setLoading(true);
      const data = await getAllIncidents();
      setIncidents(data);
    } catch (err) {
      setError("Error al cargar los incidentes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIncidentes();
  }, []);

  const handleEliminar = async (id, area) => {
    if (!window.confirm(`¿Está seguro de eliminar el incidente del área: ${area}?`)) return;
    
    try {
      await deleteIncident(id);
      await cargarIncidentes();
    } catch (err) {
      alert("Error al eliminar el incidente: " + err.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alto': return 'error';
      case 'Medio': return 'warning';
      case 'Bajo': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Alto': return <Warning />;
      case 'Medio': return <Info />;
      case 'Bajo': return <CheckCircle />;
      default: return <Info />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando incidentes...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (incidents.length === 0) {
    return (
      <Alert severity="info">
        No hay incidentes registrados. ¡Crea el primero!
      </Alert>
    );
  }

  return (
    <>
      {/* =============================== */}
      {/*         FILTROS AVANZADOS      */}
      {/* =============================== */}
      <Box sx={{ p: 2, mb: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtros Avanzados
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Área"
              value={filtros.area}
              onChange={(e) => setFiltros({ ...filtros, area: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={filtros.priorityLevel}
                label="Prioridad"
                onChange={(e) => setFiltros({ ...filtros, priorityLevel: e.target.value })}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="Alto">Alto</MenuItem>
                <MenuItem value="Medio">Medio</MenuItem>
                <MenuItem value="Bajo">Bajo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Usuario"
              value={filtros.registeredUser}
              onChange={(e) => setFiltros({ ...filtros, registeredUser: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={aplicarFiltro}
              sx={{ mt: 1 }}
            >
              Aplicar Filtros
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* =============================== */}
      {/*        TABLA DE INCIDENTES      */}
      {/* =============================== */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de incidentes">
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Área</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prioridad</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.incidentId} hover>
                <TableCell>{incident.incidentId}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {incident.area}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {incident.description.length > 100 
                      ? `${incident.description.substring(0, 100)}...` 
                      : incident.description
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(incident.incidentDate).toLocaleDateString('es-PE')}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getPriorityIcon(incident.priorityLevel)}
                    label={incident.priorityLevel}
                    color={getPriorityColor(incident.priorityLevel)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{incident.registeredUser}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => onEditar(incident)}
                      title="Editar incidente"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleEliminar(incident.incidentId, incident.area)}
                      title="Eliminar incidente"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
