// Clase que representa cada transacción/donación
class Transaction {
    constructor(id, donor, amount, timestamp, description = "") {
      this.id = id;                   // Identificador único (se usa Date.now())
      this.donor = donor;             // Nombre o identificador del donante
      this.amount = amount;           // Monto de la donación
      this.timestamp = timestamp;     // Fecha y hora de la transacción
      this.description = description; // Descripción (ej. "Donation")
      this.next = null;               // Puntero al siguiente nodo de la lista
    }
  }
  
  // Clase para implementar la lista enlazada de transacciones
  class LinkedList {
    constructor() {
      this.head = null; // Inicio de la lista
    }
    
    // Agregar una transacción al final de la lista (registro cronológico)
    addTransaction(transaction) {
      if (!this.head) {
        this.head = transaction;
      } else {
        let current = this.head;
        while (current.next) {
          current = current.next;
        }
        current.next = transaction;
      }
    }
    
    // Eliminar una transacción por su ID
    removeTransactionById(id) {
      if (!this.head) return;
      if (this.head.id === id) {
        this.head = this.head.next;
        return;
      }
      let current = this.head;
      while (current.next && current.next.id !== id) {
        current = current.next;
      }
      if (current.next) {
        current.next = current.next.next;
      }
    }
    
    // Mostrar el historial completo de transacciones
    showHistory() {
      let current = this.head;
      while (current) {
        console.log(`ID: ${current.id}, Donante: ${current.donor}, Monto: Q${current.amount}, Fecha: ${current.timestamp}, Desc: ${current.description}`);
        current = current.next;
      }
    }
  }
  
  // Clase que simula el smart contract de crowdfunding para el proyecto médico
  class CrowdfundingContract {
    constructor(meta, distributionPercentages, emergencyThreshold, earlyReleaseEnabled = true) {
      this.transactions = new LinkedList(); // Lista de todas las donaciones
      this.totalDonations = 0;                // Acumulado de donaciones en la ronda actual
      this.meta = meta;                       // Meta de financiamiento (ej. Q2,000,000)
      this.distributionPercentages = distributionPercentages; // Porcentajes asignados a cada área
      this.emergencyReserve = 0;              // Fondo de imprevistos acumulado en distribuciones previas
      this.emergencyThreshold = emergencyThreshold; // Umbral para activar transferencia desde el fondo de imprevistos (ej. Q1,000,000)
      this.earlyReleaseEnabled = earlyReleaseEnabled; // Permitir liberación anticipada en casos extremos
      this.mainFund = 0;                      // Fondo principal que se usa para distribuir
    }
    
    // Función para recibir donaciones
    addDonation(amount, donor) {
      // Aquí se podría validar que el donante tenga saldo suficiente, simulamos que siempre es válido.
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
      
      // Transferir las donaciones al fondo principal
      this.mainFund += this.totalDonations;
      // Reiniciar el contador de donaciones para la siguiente ronda
      this.totalDonations = 0;
      
      // Objeto para almacenar los montos distribuidos a cada área
      let distributionResults = {};
      for (let area in this.distributionPercentages) {
        let percent = this.distributionPercentages[area];
        let amountForArea = (this.mainFund * percent) / 100;
        distributionResults[area] = amountForArea;
        console.log(`Área: ${area}, ${percent}% => Q${amountForArea}`);
      }
      
      // Actualizar el fondo de imprevistos (última área de distribución)
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
  
  // (Opcional) Simulación de liberación anticipada en caso de necesidad
  // crowdfunding.earlyRelease();
  