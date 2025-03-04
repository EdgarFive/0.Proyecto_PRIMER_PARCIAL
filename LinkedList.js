// LinkedList.js
// Clase para implementar una lista enlazada que almacena transacciones.

import Transaction from './Transaction.js';

class LinkedList {
    constructor() {
        this.head = null; // Puntero al primer nodo de la lista
        this.length = 0;  // Contador de elementos en la lista
    }
  
    // Agrega una nueva transacción a la lista enlazada
    addTransaction(transaction) {
        if (!(transaction instanceof Transaction)) {
            throw new Error('Invalid transaction object'); // Verifica que el objeto sea una instancia de Transaction
        }

        const newNode = {
            data: transaction,
            next: null
        };

        if (!this.head) {
            // Si la lista está vacía, el nuevo nodo se convierte en la cabeza
            this.head = newNode;
        } else {
            // Recorre la lista hasta encontrar el último nodo y lo enlaza al nuevo nodo
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.length++;  // Incrementa el contador de elementos en la lista
    }
  
    // Elimina una transacción por su ID y devuelve true si se eliminó con éxito
    removeTransactionById(id) {
        if (!this.head) return false;  // Retorna false si la lista está vacía
        
        if (this.head.data.id === id) {
            // Si el primer nodo es el que se quiere eliminar, se cambia la cabeza
            this.head = this.head.next;
            this.length--;  // Reduce el contador
            return true;
        }
        
        let current = this.head;
        while (current.next && current.next.data.id !== id) {
            current = current.next; // Recorre la lista buscando el nodo a eliminar
        }
        
        if (current.next) {
            // Si se encuentra el nodo, se elimina saltándolo en la referencia
            current.next = current.next.next;
            this.length--;  // Reduce el contador
            return true;
        }
        return false;  // Retorna false si no se encontró el ID en la lista
    }

    // Convierte la lista enlazada a un array de objetos transacción
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

    // Reconstruye la lista enlazada a partir de un array de transacciones
    fromArray(array) {
        if (!Array.isArray(array)) {
            throw new Error('Input must be an array'); // Verifica que el parámetro sea un array
        }

        this.head = null; // Reinicia la lista enlazada
        array.forEach(item => {
            // Crea nuevas instancias de Transaction a partir del array y las agrega a la lista
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
