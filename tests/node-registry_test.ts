import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensures node registration works",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "node-registry",
        "register-node",
        [
          types.ascii("node-001"),
          types.utf8("test node metadata")
        ],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Ensures status update with invalid status fails",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "node-registry", 
        "register-node",
        [
          types.ascii("node-001"),
          types.utf8("test node metadata")
        ],
        wallet_1.address
      ),
      Tx.contractCall(
        "node-registry",
        "update-status",
        [
          types.ascii("node-001"),
          types.ascii("invalid")
        ],
        wallet_1.address
      )
    ]);
    
    block.receipts[1].result.expectErr(102);
  },
});
