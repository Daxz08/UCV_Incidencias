import { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { getIncidentMetrics } from "../../services/incidentService"; // <-- importar

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarMetrics = async () => {
    try {
      setLoading(true);
      const data = await getIncidentMetrics();
      console.log("Métricas recibidas:", data);
      setMetrics(data);
    } catch (err) {
      console.error("Error cargando métricas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMetrics();
  }, []);

  // ✅ Aquí manejamos loading o metrics null
  if (loading || !metrics) return <CircularProgress />;

  // ✅ Aquí va tu render principal
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Paper sx={{ p: 2, minWidth: 150 }}>
        <Typography variant="h6">Total Incidencias</Typography>
        <Typography variant="h4">{metrics?.total ?? 0}</Typography>
      </Paper>
      <Paper sx={{ p: 2, minWidth: 150, backgroundColor: "#f44336", color: "white" }}>
        <Typography variant="h6">Alto</Typography>
        <Typography variant="h4">{metrics?.alto ?? 0}</Typography>
      </Paper>
      <Paper sx={{ p: 2, minWidth: 150, backgroundColor: "#ff9800", color: "white" }}>
        <Typography variant="h6">Medio</Typography>
        <Typography variant="h4">{metrics?.medio ?? 0}</Typography>
      </Paper>
      <Paper sx={{ p: 2, minWidth: 150, backgroundColor: "#4caf50", color: "white" }}>
        <Typography variant="h6">Bajo</Typography>
        <Typography variant="h4">{metrics?.bajo ?? 0}</Typography>
      </Paper>
    </Box>
  );
}