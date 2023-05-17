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
      //write the change to the file systems
      Deno.writeTextFileSync(
        "./file.okv",
        getStringRepresentation(GlobalStorage),
      );
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
      // write the change to the file system
      Deno.writeTextFileSync(
        "./file.okv",
        getStringRepresentation(GlobalStorage),
      );
    } else {
      console.error("COMMIT_ERROR: Nothing to commit.");
    }
  }
}
