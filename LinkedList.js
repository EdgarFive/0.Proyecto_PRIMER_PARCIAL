// LinkedList.js
// Clase para implementar la lista enlazada de transacciones.

import Transaction from './Transaction.js';

class LinkedList {
    constructor() {
        this.head = null;
        this.length = 0;  // Agregar contador de elementos
    }
  
    addTransaction(transaction) {
        if (!(transaction instanceof Transaction)) {
            throw new Error('Invalid transaction object');
        }

        const newNode = {
            data: transaction,
            next: null
        };

        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.length++;  // Incrementar contador
    }
  
    removeTransactionById(id) {
        if (!this.head) return false;  // Retornar false si no se encontró
        
        if (this.head.data.id === id) {
            this.head = this.head.next;
            this.length--;  // Decrementar contador
            return true;
        }
        
        let current = this.head;
        while (current.next && current.next.data.id !== id) {
            current = current.next;
        }
        
        if (current.next) {
            current.next = current.next.next;
            this.length--;  // Decrementar contador
            return true;
        }
        return false;
    }

    toArray() {
        const array = [];
        let current = this.head;
        while (current) {
            array.push({
                id: current.data.id,
                donor: current.data.donor,
                amount: current.data.amount,
                timestamp: current.data.timestamp,
                description: current.data.description
            });
            current = current.next;
        }
        return array;
    }

    fromArray(array) {
        if (!Array.isArray(array)) {
            throw new Error('Input must be an array');
        }

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
