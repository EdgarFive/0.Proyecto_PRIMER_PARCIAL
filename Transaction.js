// Clase que representa cada transacción/donación.
// Cada instancia contiene los datos de la donación y se usa como nodo en la lista enlazada.

class Transaction {
    constructor(id, donor, amount, timestamp, description = "") {
        // Validaciones para asegurar que los datos sean correctos
        if (!id) throw new Error('Transaction ID is required'); // Verifica que el ID sea válido
        if (!donor) throw new Error('Donor information is required'); // El donante debe estar definido
        if (!amount || amount <= 0) throw new Error('Invalid donation amount'); // El monto debe ser positivo
        if (!(timestamp instanceof Date)) throw new Error('Invalid timestamp'); // La fecha debe ser un objeto Date

        this.id = id;                   // Identificador único de la transacción (usualmente generado con Date.now())
        this.donor = donor;             // Nombre o identificador del donante
        this.amount = Number(amount);    // Convierte el monto a número para evitar errores
        this.timestamp = timestamp;      // Fecha y hora en que se realizó la donación
        this.description = description;  // Descripción opcional de la donación
    }

    // Método que convierte la transacción en un objeto JSON para almacenamiento o transferencia de datos
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
