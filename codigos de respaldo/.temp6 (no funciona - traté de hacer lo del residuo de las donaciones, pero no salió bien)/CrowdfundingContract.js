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
            if (this.totalDonations + transaction.amount > this.meta) {
                // Calcular el monto necesario para alcanzar la meta
                const neededAmount = this.meta - this.totalDonations;
                const excess = transaction.amount - neededAmount;

                // Crear transacción con el monto necesario
                const mainTransaction = new Transaction(
                    Date.now(),
                    transaction.donor,
                    neededAmount,
                    new Date(),
                    "Donación médica"
                );
                this.transactions.addTransaction(mainTransaction);
                this.totalDonations += neededAmount;

                // Distribuir fondos al alcanzar la meta
                this.distributeFunds();

                // Crear nueva transacción con el excedente
                if (excess > 0) {
                    const excessTransaction = new Transaction(
                        Date.now(),
                        transaction.donor,
                        excess,
                        new Date(),
                        "Excedente de donación"
                    );
                    this.transactions.addTransaction(excessTransaction);
                    this.totalDonations = excess;
                }
            } else {
                this.transactions.addTransaction(transaction);
                this.totalDonations += transaction.amount;
            }
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
            this.transactions.addTransaction(newTransaction);
            this.totalDonations += amount;
            transaction = newTransaction;
        } else {
            throw new Error('Invalid donation parameters');
        }
        
        return transaction;
    }
    distributeFunds() {
        this.mainFund += this.totalDonations;
        this.totalDonations = 0;
        
        let distributionResults = {};
        for (let area in this.distributionPercentages) {
            let percent = this.distributionPercentages[area];
            let amountForArea = (this.mainFund * percent) / 100;
            distributionResults[area] = amountForArea;
        }
        
        if (this.EMERGENCY_AREA in distributionResults) {
            this.emergencyReserve += distributionResults[this.EMERGENCY_AREA];
            
            if (this.emergencyReserve >= this.emergencyThreshold) {
                let transferAmount = this.emergencyReserve * 0.5;
                this.mainFund += transferAmount;
                this.emergencyReserve -= transferAmount;
            }
        }
        
        this.mainFund = 0;
        return distributionResults;
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
