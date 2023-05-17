import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

type KVMap = {
  [key: string]: string;
};
const GlobalStorage: KVMap = {};

interface Transaction {
  store: KVMap;
  next: Transaction | null;
}

// utility function to convert the KVMap to string to be writable to a file
function getStringRepresentation(kv: KVMap): string {
  return `TRANSACTION: ${kv.key} -> ${kv.value}`;
}

class TransactionStack {
  private top: Transaction | null = null;
  private size: number = 0;
  public pushTransaction(): void {
    const temp: Transaction = {
      store: {},
      next: this.top,
    };
    //change the top of the stack to this value
    this.top = temp;
    // add update the stack size
    this.size += 1;
  }
  public popTransaction(): void {
    // can only pop from the stack if filled, else return stack underflow
    if (this.top === null) {
      console.error("STACK_UNDERFLOW: No Active Transactions to remove from.");
    } else {
      // change the top of the stack to the next one
      this.top = this.top.next;
      // and update the stack size.
      this.size -= 1;
    }
  }
  public Peek(): Transaction | null {
    //return the top of the transaction stack
    return this.top;
  }

  public Rollback() {
    //rollback a transaction
    // first check if at least a transaction exists
    if (this.top === null) {
      console.error("ROLLBACK_ERROR: No Active Transactions to Rollback from.");
    } else {
      // remove the transaction from the stack
      for (const key in this.top.store) {
        delete this.top.store[key];
      }
    }
  }
  public Commit(): void {
    const activeTransaction = this.Peek();
    if (activeTransaction !== null) {
      for (const key in activeTransaction.store) {
        GlobalStorage[key] = activeTransaction.store[key];
        if (activeTransaction.next !== null) {
          activeTransaction.next.store[key] = activeTransaction.store[key];
        }
      }
    } else {
      console.error("COMMIT_ERROR: Nothing to commit.");
    }
  }
  public Write(): void {
    // write data to local
    Deno.writeTextFileSync(
      "./file.okv",
      getStringRepresentation(GlobalStorage),
    );
  }
}

function Get(key: string, ts: TransactionStack): void {
  const activeTransaction = ts.Peek();
  if (activeTransaction === null) {
    if (key in GlobalStorage) {
      console.log(GlobalStorage[key]);
    } else {
      console.log(`${key} is not set.`);
    }
  } else {
    if (key in activeTransaction.store) {
      console.log(activeTransaction.store[key]);
    } else {
      console.log(`${key} is not set`);
    }
  }
}

function Set(key: string, value: string, ts: TransactionStack): void {
  const activeTransaction = ts.Peek();
  if (activeTransaction === null) {
    GlobalStorage[key] = value;
  } else {
    activeTransaction.store[key] = value;
  }
}

function Count(value: string, ts: TransactionStack): void {
  let count = 0;
  const activeTransaction = ts.Peek();

  if (activeTransaction === null) {
    for (const key in GlobalStorage) {
      if (GlobalStorage[key] === value) {
        count += 1;
      }
    }
  } else {
    for (const key in activeTransaction.store) {
      if (activeTransaction.store[key] === value) {
        count += 1;
      }
    }
  }
  console.log(count);
}

function Delete(key: string, ts: TransactionStack): void {
  const activeTransaction = ts.Peek();
  if (activeTransaction === null) {
    delete GlobalStorage[key];
  } else {
    delete activeTransaction.store[key];
  }
  console.log(`${key} was deleted from kv.`);
}
