// index.js
import SmartContract from './SmartContract.js';

// Crear una instancia del smart contract
const crowdfunding = new SmartContract();

// Simular al menos 5 transacciones (donaciones)
crowdfunding.addDonation("Donante A", 500000);
crowdfunding.addDonation("Donante B", 400000);
crowdfunding.addDonation("Donante C", 600000);
crowdfunding.addDonation("Donante D", 300000);
crowdfunding.addDonation("Donante E", 300000); // Con esta donación se supera la meta

// Mostrar el historial de transacciones
crowdfunding.showAllTransactions();
