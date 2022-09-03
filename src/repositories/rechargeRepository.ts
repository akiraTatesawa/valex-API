import { connection } from "../dbStrategy/postgres/connection";
import { Recharge } from "../interfaces/rechargeInterfaces";

export type RechargeInsertData = Omit<Recharge, "id" | "timestamp">;

export async function findByCardId(cardId: number) {
  const result = await connection.query<Recharge, [number]>(
    `SELECT * FROM recharges WHERE "cardId"=$1`,
    [cardId]
  );

  return result.rows;
}

export async function insert(rechargeData: RechargeInsertData) {
  const { cardId, amount } = rechargeData;

  connection.query<any, [number, number]>(
    `INSERT INTO recharges ("cardId", amount) VALUES ($1, $2)`,
    [cardId, amount]
  );
}

export interface RechargeRepositoryInterface {
  findByCardId: (cardId: number) => Promise<Recharge[]>;
  insert: (rechargeData: RechargeInsertData) => Promise<void>;
}

export class RechargeRepository implements RechargeRepositoryInterface {
  async findByCardId(cardId: number) {
    const result = await connection.query<Recharge, [number]>(
      `SELECT * FROM recharges WHERE "cardId"=$1`,
      [cardId]
    );

    return result.rows;
  }

  async insert(rechargeData: RechargeInsertData) {
    const { cardId, amount } = rechargeData;

    connection.query<any, [number, number]>(
      `INSERT INTO recharges ("cardId", amount) VALUES ($1, $2)`,
      [cardId, amount]
    );
  }
}
