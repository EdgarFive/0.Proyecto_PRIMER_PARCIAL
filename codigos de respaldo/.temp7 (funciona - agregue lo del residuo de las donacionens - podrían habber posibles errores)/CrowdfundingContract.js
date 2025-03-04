// Clase que simula el smart contract de crowdfunding para un proyecto comunitario médico en Guatemala.
// Utiliza una lista enlazada para almacenar las donaciones y, al alcanzar la meta, distribuye automáticamente los fondos según porcentajes preestablecidos.

import LinkedList from './LinkedList.js';
import Transaction from './Transaction.js';

class CrowdfundingContract {
    constructor(meta, distributionPercentages, emergencyThreshold = 1000000, earlyReleaseEnabled = true) {
        this.transactions = new LinkedList();
        this.totalDonations = 0;
        this.meta = meta;
        this.distributionPercentages = distributionPercentages;
        this.emergencyReserve = 0;
        this.emergencyThreshold = emergencyThreshold;
        this.earlyReleaseEnabled = earlyReleaseEnabled;
        this.mainFund = 0;
        this.EMERGENCY_AREA = "Fondo de Emergencia";
    }

    addDonation(transaction) {
        if (transaction instanceof Transaction) {
            const remainingToGoal = this.meta - this.totalDonations;
            
            if (transaction.amount > remainingToGoal && remainingToGoal > 0) {
                // Primera transacción para completar la meta actual
                const firstTransaction = new Transaction(
                    Date.now(),
                    transaction.donor,
                    remainingToGoal,
                    new Date(),
                    "Donación médica - Completar meta actual"
                );
                this.transactions.addTransaction(firstTransaction);
                this.totalDonations += remainingToGoal;
                
                // Distribuir fondos de la meta actual
                this.distributeFunds();
                
                // Segunda transacción para la siguiente meta
                const excessAmount = transaction.amount - remainingToGoal;
                const secondTransaction = new Transaction(
                    Date.now() + 1,
                    transaction.donor,
                    excessAmount,
                    new Date(),
                    "Donación médica - Siguiente meta"
                );
                this.transactions.addTransaction(secondTransaction);
                this.totalDonations = excessAmount; // Iniciar nueva meta con el excedente
                
                return secondTransaction;
            }
            
            this.transactions.addTransaction(transaction);
            this.totalDonations += transaction.amount;
            
            if (this.totalDonations >= this.meta) {
                this.distributeFunds();
            }
            
            return transaction;
        } else if (typeof transaction === 'number' && arguments.length > 1) {
            const amount = transaction;
            const donor = arguments[1];
            const newTransaction = new Transaction(
                Date.now(),
                donor,
                amount,
                new Date(),
                "Donación médica"
            );
            return this.addDonation(newTransaction);
        } else {
            throw new Error('Parámetros de donación inválidos');
        }
    }

    distributeFunds() {
        const distribution = this.getFundDistribution();
        
        // Guardar la distribución en localStorage
        const goalReached = {
            totalAmount: this.totalDonations,
            date: new Date(),
            distribution: distribution
        };
        localStorage.setItem('goalReached', JSON.stringify(goalReached));
        
        // Reiniciar para la siguiente meta
        this.mainFund = 0;
        this.totalDonations = 0;
        
        return distribution;
    }

    earlyRelease() {
        if (this.earlyReleaseEnabled && this.totalDonations > 0) {
            return this.distributeFunds();
        }
        return null;
    }

    getTransactions() {
        return this.transactions.toArray();
    }

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

    getFundDistribution() {
        const distribution = {};
        const total = this.totalDonations;
        
        Object.entries(this.distributionPercentages).forEach(([area, percentage]) => {
            distribution[area] = (total * percentage) / 100;
        });
        
        return distribution;
    }

    generateCertificate(donor) {
        const totalDonated = this.getUserDonations(donor);
        
        return {
            donor,
            totalDonated,
            date: new Date(),
            impact: this.calculateUserImpact(totalDonated)
        };
    }

    calculateUserImpact(amount) {
        const impact = {};
        for (let [area, percentage] of Object.entries(this.distributionPercentages)) {
            impact[area] = (amount * percentage) / 100;
        }
        return impact;
    }
}

export default CrowdfundingContract;
