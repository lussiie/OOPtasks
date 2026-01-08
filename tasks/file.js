class BankAccount {
  #balance = 0;

  constructor(accountNumber, type) {
    if (new.target === BankAccount) {
      throw new Error("this is an abstract class");
    }
    this.accountNumber = accountNumber;
    this.type = type;
  }

  deposit(amount) {
    throw new Error("this is an abstract method");
  }

  withdraw(amount) {
    throw new Error("this is an abstarct method");
  }

  transferFunds(targetAccount, amount, actor) {
    throw new Error("this is an abstrac method");
  }

  _add(amount) {
    this.#balance += amount;
  }

  _sub(amount) {
    this.#balance -= amount;
  }
}

class IndividualAccount extends BankAccount {
  constructor(accountNumber) {
    super(accountNumber, "individual");
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("amount can't be negative");
    }
    this._add(amount);
  }

  withdraw(amount) {
    if (amount <= 0) {
      throw new Error("amount can't be negative");
    }
    this._sub(amount);
  }
}

class JointAccount extends BankAccount {
  constructor(accountNumber, owners) {
    super(accountNumber, "joint");
    this.owners = owners;
  }

  deposit(amount) {
    this._add(amount);
  }

  withdraw(amount, actor) {
    if (!this.owners.includes(actor)) {
      throw new Error("Not an actor");
    }
    this._sub(amount);
  }
}

class Customer {
  constructor(name, contactInformation) {
    this.accounts = [];
    this.name = name;
    this.contactInformation = contactInformation;
  }

  set name(value) {
    if (!value || value.length == 2 && value.length <= 0) {
      throw new Error("such name does not exist");
    }
    this._name = value;
  }

  get name() {
    return this._name;
  }

  set contactInfo(value) {
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
      !/^\+?\d{8,15}$/.test(value)
    ) {
      throw new Error("Invalid && wrong contact info");
    }
    this._contactInfo = value;
  }

  get contactInfo() {
    return this._contactInfo;
  }

  addAccount(account) {
    this.accounts.push(account);
  }

  viewAccounts() {
    return this.accounts;
  }

  viewTransactionHistory(accountNumber) {
    const acc = this.accounts.find(a => a.accountNumber === accountNumber);
    if (!acc) {
      throw new Error("Account not found");
    }
    return acc.getTransactions();
  }
}

class Transaction {
  constructor(accountNumber, amount, transactiontype, fromAccount, toAccount) {
    fromAccount = null;
    toAccount = null;

    if (
      transactiontype !== "deposit" &&
      transactiontype !== "withdraw" &&
      transactiontype !== "transfer"
    ) {
      throw new Error("wrong or invalid transaction tyoe");
    }

    this.accountNumber = accountNumber;
    this.amount = amount;
    this.transactiontype = transactiontype;
  }
}

Object.defineProperty(BankAccount.prototype, "accountNumber", {
  configurable: false,
  enumerable: true,
  get() {
    return this._accountNumber;
  },
  set(value) {
    if (!/^\d{10}$/.test(value)) {
      throw new Error("must be exactly 10 digits");
    }
    this._accountNumber = value;
  }
});

Object.defineProperty(BankAccount.prototype, "balance", {
  configurable: false,
  enumerable: true,
  get() {
    return this._balance || 0;
  },
  set(value) {
    if (typeof value !== "number" || value < 0) {
      throw new Error("our balance must be no negative");
    }
    this._balance = value;
  }
});

function logging(Method) {
  return function (...args) {
    const result = Method.apply(this, args);

    const entry = {
      timestamp: new Date().toString(),
      operation: Method.name,
      account: this.accountNumber,
      args
    };

    console.log("LOG:", entry);
    return result;
  };
}

function Permission(Method) {
  return function (targetAccount, amount, actor) {
    if (!actor || (!actor.isAuthorized && !this.owners?.includes(actor))) {
      throw new Error("Actor not authorized to transfer funds");
    }

    return Method.apply(this, [targetAccount, amount, actor]);
  };
}
