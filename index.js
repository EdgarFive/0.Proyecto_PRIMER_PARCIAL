import CrowdfundingContract from './CrowdfundingContract.js';

// Configuración del smart contract:
// Meta: Q2,000,000
// Distribución de fondos según áreas (en porcentajes)
const distributionPercentages = {
  "Servicios de Atención Primaria": 20,
  "Salud Materno-Infantil": 15,
  "Salud Sexual y Reproductiva": 10,
  "Educación y Capacitación en Salud": 10,
  "Nutrición y Seguridad Alimentaria": 10,
  "Salud Mental y Apoyo Psicosocial": 10,
  "Infraestructura y Equipamiento Médico": 10,
  "Logística y Cadena de Suministros": 5,
  "Monitoreo, Evaluación y Gestión Administrativa": 5,
  "Fondo para resguardar dinero por cualquier imprevisto": 5
};

const meta = 2000000;            // Q2,000,000
const emergencyThreshold = 1000000; // Q1,000,000 para el fondo de imprevistos

// Crear instancia del smart contract
const crowdfunding = new CrowdfundingContract(meta, distributionPercentages, emergencyThreshold);

// Simulación de al menos 5 transacciones (donaciones)
crowdfunding.addDonation(500000, "Donante A");
crowdfunding.addDonation(400000, "Donante B");
crowdfunding.addDonation(600000, "Donante C");
crowdfunding.addDonation(300000, "Donante D");
crowdfunding.addDonation(300000, "Donante E"); // Con esta donación se supera la meta y se activa la distribución

// Mostrar historial de transacciones para ambas partes (donantes y administradores)
crowdfunding.showHistory();

// (Opcional) Para probar la liberación anticipada en caso de emergencia
// crowdfunding.earlyRelease();
