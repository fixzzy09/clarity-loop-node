import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensures data submission works for registered nodes",
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
        "node-data",
        "submit-data",
        [
          types.ascii("node-001"),
          types.utf8("temperature:25.5,humidity:60")
        ],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 2);
    assertEquals(block.height, 2);
    
    block.receipts[1].result.expectOk().expectBool(true);
  },
});
