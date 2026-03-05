class Wallet {
    constructor(owner, initial_balance = 0){
        this.owner = owner;
        this.balance = initial_balance;
    }

    addFunds(amount){
        this.balance += amount;
    }

    pay(amount, concept = ""){
        if(amount > this.balance){
            console.log("Saldo Insuficiente");
            return false;
        } else {
            this.balance -= amount;
            return true;
        }
    }

    getBalance(){
        return this.balance;
    }

    summary(){
        return `@${this.owner} | balance: ${this.balance.toFixed(2)}€`;
    }
}

class PremiumWallet extends Wallet {
    constructor(owner, initial_balance = 0, cashbackRate = 0.02){
        super(owner, initial_balance);
        this.cashbackRate = cashbackRate;
    }

    pay(amount, concept = ""){
        if(super.pay(amount, concept)){
            const cashback = amount * this.cashbackRate;
            this.addFunds(cashback);
            console.log(`Cashback de ${cashback.toFixed(2)}€ aplicado`);
            return true;
        }        return false;
    }

    summary() {
        return `@${this.owner} | balance: ${this.balance.toFixed(2)}€ | cashback rate: ${(this.cashbackRate * 100).toFixed(2)}%`;
    }
}

walletRufo = new Wallet("Rufo", 300);
walletJudia = new Wallet("Judia", 500);

console.log("Saldo Rufo " + walletRufo.summary());
console.log("Saldo Judio: " + walletJudia.summary());

walletRufo.addFunds(300);
walletJudia.addFunds(1000);

console.log("Saldo Rufo " + walletRufo.summary());
console.log("Saldo Judio: " + walletJudia.summary());

walletJudia.pay(200, "Compra de comida");
walletRufo.pay(100, "Compra de comida");    

console.log("Saldo Rufo " + walletRufo.summary());
console.log("Saldo Judio: " + walletJudia.summary());

walletJudia.pay(2000, "Compra de coche");

console.log("Saldo Rufo " + walletRufo.summary());
console.log("Saldo Judio: " + walletJudia.summary());

walletAsier = new PremiumWallet("Asier", 1000, 0.05);
console.log("Saldo Asier: " + walletAsier.summary());

walletAsier.pay(200, "Compra de comida");
console.log("Saldo Asier: " + walletAsier.summary());



