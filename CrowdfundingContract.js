// Clase que simula un contrato inteligente de crowdfunding para un proyecto comunitario médico en Guatemala.

import LinkedList from './LinkedList.js';
import Transaction from './Transaction.js';

class CrowdfundingContract {
    // Inicializamos el constructor ==============
    constructor(meta, distributionPercentages, emergencyThreshold = 1000000, earlyReleaseEnabled = true) {
        this.transactions = new LinkedList(); // Lista enlazada para almacenar donaciones
        this.totalDonations = 0; // Suma total de donaciones recibidas
        this.meta = meta; // Meta de recaudación
        this.distributionPercentages = distributionPercentages; // Porcentajes de distribución de los fondos
        this.emergencyReserve = 0; // Fondo de emergencia
        this.emergencyThreshold = emergencyThreshold; // Umbral de emergencia
        this.earlyReleaseEnabled = earlyReleaseEnabled; // Indica si se pueden liberar fondos antes de la meta
        this.mainFund = 0; // Fondo principal
        this.EMERGENCY_AREA = "Fondo de Emergencia"; // Área especial de emergencia
    }
    
    // Método para agregar una donación y manejar el exceso si se supera la meta
    addDonation(transaction) {
        if (transaction instanceof Transaction) {
            const remainingToGoal = this.meta - this.totalDonations;
            
            if (transaction.amount > remainingToGoal && remainingToGoal > 0) {
                // Si la donación supera la meta actual, se divide en dos transacciones
                
                // Primera transacción: completa la meta actual
                const firstTransaction = new Transaction(
                    Date.now(), transaction.donor, remainingToGoal, new Date(),
                    "Donación médica - Completar meta actual"
                );
                this.transactions.addTransaction(firstTransaction);
                this.totalDonations += remainingToGoal;
                
                // Distribuir fondos ya que se alcanzó la meta
                this.distributeFunds();
                
                // Segunda transacción: el excedente se cuenta para la siguiente meta
                const excessAmount = transaction.amount - remainingToGoal;
                const secondTransaction = new Transaction(
                    Date.now() + 1, transaction.donor, excessAmount, new Date(),
                    "Donación médica - Siguiente meta"
                );
                this.transactions.addTransaction(secondTransaction);
                this.totalDonations = excessAmount; // Reiniciar con el nuevo monto
                
                return secondTransaction;
            }
            
            // Si la donación no excede la meta, solo se agrega
            this.transactions.addTransaction(transaction);
            this.totalDonations += transaction.amount;
            
            // Si se alcanza la meta, se distribuyen los fondos
            if (this.totalDonations >= this.meta) {
                this.distributeFunds();
            }
            
            return transaction;
        } else if (typeof transaction === 'number' && arguments.length > 1) {
            // Permite registrar donaciones directamente con cantidad y donante
            const amount = transaction;
            const donor = arguments[1];
            const newTransaction = new Transaction(
                Date.now(), donor, amount, new Date(), "Donación médica"
            );
            return this.addDonation(newTransaction);
        } else {
            throw new Error('Parámetros de donación inválidos');
        }
    }

    // Método que distribuye los fondos según los porcentajes al alcanzar la meta
    distributeFunds() {
        const distribution = this.getFundDistribution();
        
        // Guarda la distribución en localStorage
        const goalReached = {
            totalAmount: this.totalDonations,
            date: new Date(),
            distribution: distribution
        };
        localStorage.setItem('goalReached', JSON.stringify(goalReached));
        
        // Reinicia las variables para la siguiente meta
        this.mainFund = 0;
        this.totalDonations = 0;
        
        return distribution;
    }

    // Método para liberar fondos antes de alcanzar la meta si está habilitado
    earlyRelease() {
        if (this.earlyReleaseEnabled && this.totalDonations > 0) {
            return this.distributeFunds();
        }
        return null;
    }

    // Devuelve todas las transacciones almacenadas en la lista enlazada
    getTransactions() {
        return this.transactions.toArray();
    }

    // Calcula el total de donaciones realizadas por un donante específico
    getUserDonations(donor) {
        let total = 0;
        let current = this.transactions.head;
        
        while (current) {
            if (current.data.donor === donor) {
                total += current.data.amount;
            }
            current = current.next;
        }
        
        return total;
    }

    // Calcula cómo se distribuyen los fondos según los porcentajes asignados
    getFundDistribution() {
        const distribution = {};
        const total = this.totalDonations;
        
        Object.entries(this.distributionPercentages).forEach(([area, percentage]) => {
            distribution[area] = (total * percentage) / 100;
        });
        
        return distribution;
    }

    // Genera un certificado de donación para un donante con su impacto total
    generateCertificate(donor) {
        const totalDonated = this.getUserDonations(donor);
        
        return {
            donor,
            totalDonated,
            date: new Date(),
            impact: this.calculateUserImpact(totalDonated)
        };
    }

    // Calcula el impacto de una donación en cada área del proyecto según los porcentajes
    calculateUserImpact(amount) {
        const impact = {};
        for (let [area, percentage] of Object.entries(this.distributionPercentages)) {
            impact[area] = (amount * percentage) / 100;
        }
        return impact;
    }
}

export default CrowdfundingContract;