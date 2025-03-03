// Clase que representa cada transacción/donación.
// Cada instancia contiene los datos de la donación y se utiliza como nodo en la lista enlazada.

class Transaction {
    constructor(id, donor, amount, timestamp, description = "") {
        // Validaciones
        if (!id) throw new Error('Transaction ID is required');
        if (!donor) throw new Error('Donor information is required');
        if (!amount || amount <= 0) throw new Error('Invalid donation amount');
        if (!(timestamp instanceof Date)) throw new Error('Invalid timestamp');

        this.id = id;                   // Identificador único (se usa Date.now())
        this.donor = donor;             // Nombre o identificador del donante
        this.amount = Number(amount);    // Asegurar que amount sea número
        this.timestamp = timestamp;      // Fecha y hora de la transacción
        this.description = description;  // Descripción (ej. "Donation")
    }

    toJSON() {
        return {
            id: this.id,
            donor: this.donor,
            amount: this.amount,
            timestamp: this.timestamp,
            description: this.description
        };
    }
}

export default Transaction;
  