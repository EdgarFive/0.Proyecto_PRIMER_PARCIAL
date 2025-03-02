// Clase que representa cada transacción/donación.
// Cada instancia contiene los datos de la donación y se utiliza como nodo en la lista enlazada.

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
  
  export default Transaction;
  