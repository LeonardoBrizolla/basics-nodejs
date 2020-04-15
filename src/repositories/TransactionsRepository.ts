import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

enum Type {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private calculateBalence(operator: Type): number {
    return this.transactions
      .filter(transaction => transaction.type === operator)
      .reduce((acc, transaction) => acc + transaction.value, 0);
  }

  public getBalance(): Balance {
    const income = this.calculateBalence(Type.INCOME);
    const outcome = this.calculateBalence(Type.OUTCOME);
    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();

    if (type === 'outcome' && value > total) {
      throw Error('You have no balance available! ');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
