// LinkedList.js
// Clase para implementar la lista enlazada de transacciones.

import Transaction from './Transaction.js';

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

    // Convertir la lista enlazada a un array para localStorage
    toArray() {
        const array = [];
        let current = this.head;
        while (current) {
            array.push({
                id: current.id,
                donor: current.donor,
                amount: current.amount,
                timestamp: current.timestamp,
                description: current.description
            });
            current = current.next;
        }
        return array;
    }

    // Reconstruir la lista desde un array
    fromArray(array) {
        this.head = null;
        array.forEach(item => {
            const transaction = new Transaction(
                item.id,
                item.donor,
                item.amount,
                new Date(item.timestamp),
                item.description
            );
            this.addTransaction(transaction);
        });
    }
}

export default LinkedList;
