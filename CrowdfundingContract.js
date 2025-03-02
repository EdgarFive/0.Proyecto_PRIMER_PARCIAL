// Clase que simula el smart contract de crowdfunding para un proyecto comunitario médico en Guatemala.
// Utiliza una lista enlazada para almacenar las donaciones y, al alcanzar la meta, distribuye automáticamente los fondos según porcentajes preestablecidos.

import LinkedList from './LinkedList.js';
import Transaction from './Transaction.js';

class CrowdfundingContract {
  constructor(meta, distributionPercentages, emergencyThreshold, earlyReleaseEnabled = true) {
    this.transactions = new LinkedList(); // Lista de todas las donaciones
    this.totalDonations = 0;                // Acumulado de donaciones en la ronda actual
    this.meta = meta;                       // Meta de financiamiento (ej. Q2,000,000)
    this.distributionPercentages = distributionPercentages; // Porcentajes asignados a cada área
    this.emergencyReserve = 0;              // Fondo de imprevistos acumulado
    this.emergencyThreshold = emergencyThreshold; // Umbral para activar transferencia desde el fondo de imprevistos (ej. Q1,000,000)
    this.earlyReleaseEnabled = earlyReleaseEnabled; // Permitir liberación anticipada en casos extremos
    this.mainFund = 0;                      // Fondo principal que se usa para distribuir
  }
  
  // Función para recibir donaciones
  addDonation(amount, donor) {
    // Se simula que siempre es válido el aporte.
    const transaction = new Transaction(Date.now(), donor, amount, new Date(), "Donation");
    this.transactions.addTransaction(transaction);
    this.totalDonations += amount;
    console.log(`Donación de Q${amount} recibida de ${donor}. Total acumulado: Q${this.totalDonations}`);
    
    // Si se alcanza o supera la meta, se ejecuta la distribución automática
    if (this.totalDonations >= this.meta) {
      this.distributeFunds();
    }
  }
  
  // Función que distribuye los fondos acumulados según los porcentajes establecidos
  distributeFunds() {
    console.log("Meta alcanzada. Ejecutando distribución de fondos...");
    
    // Transferir las donaciones al fondo principal y reiniciar el contador de donaciones
    this.mainFund += this.totalDonations;
    this.totalDonations = 0;
    
    // Objeto para almacenar los montos distribuidos a cada área
    let distributionResults = {};
    for (let area in this.distributionPercentages) {
      let percent = this.distributionPercentages[area];
      let amountForArea = (this.mainFund * percent) / 100;
      distributionResults[area] = amountForArea;
      console.log(`Área: ${area}, ${percent}% => Q${amountForArea}`);
    }
    
    // Actualizar el fondo de imprevistos (área específica)
    const emergencyArea = "Fondo para resguardar dinero por cualquier imprevisto";
    if (emergencyArea in distributionResults) {
      this.emergencyReserve += distributionResults[emergencyArea];
      console.log(`Fondo de imprevistos actualizado: Q${this.emergencyReserve}`);
      
      // Si se alcanza el umbral, transferir el 50% de ese fondo al fondo principal
      if (this.emergencyReserve >= this.emergencyThreshold) {
        let transferAmount = this.emergencyReserve * 0.5;
        console.log(`Umbral de imprevistos alcanzado (Q${this.emergencyThreshold}). Transfiriendo 50% (Q${transferAmount}) al fondo principal.`);
        this.mainFund += transferAmount;
        this.emergencyReserve -= transferAmount;
      }
    }
    
    // Notificar a los donantes (simulación de evento en tiempo real)
    console.log("Distribución completa. Se han asignado los fondos a cada área.");
    
    // Reiniciar el fondo principal para la próxima ronda (se asume que los fondos distribuidos se utilizan)
    this.mainFund = 0;
  }
  
  // Permite la liberación anticipada de fondos en caso de extrema necesidad
  earlyRelease() {
    if (this.earlyReleaseEnabled && this.totalDonations > 0) {
      console.log("Liberación anticipada activada. Distribuyendo fondos actuales aunque no se alcanzó la meta.");
      this.distributeFunds();
    } else {
      console.log("No se permite la liberación anticipada o no hay fondos para distribuir.");
    }
  }
  
  // Mostrar el historial de todas las transacciones
  showHistory() {
    console.log("Historial de transacciones:");
    this.transactions.showHistory();
  }
}

export default CrowdfundingContract;
