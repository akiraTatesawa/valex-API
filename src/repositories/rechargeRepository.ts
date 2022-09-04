import { connection } from "../dbStrategy/postgres/connection";
import { Recharge } from "../interfaces/rechargeInterfaces";

export type RechargeInsertData = Omit<Recharge, "id" | "timestamp">;

export interface RechargeRepositoryInterface {
  findByCardId: (cardId: number) => Promise<Recharge[]>;
  insert: (rechargeData: RechargeInsertData) => Promise<void>;
}

export class RechargeRepository implements RechargeRepositoryInterface {
  async findByCardId(cardId: number): Promise<Recharge[]> {
    const result = await connection.query<Recharge, [number]>(
      `SELECT * FROM recharges WHERE "cardId"=$1`,
      [cardId]
    );

    return result.rows;
  }

  async insert(rechargeData: RechargeInsertData): Promise<void> {
    const { cardId, amount } = rechargeData;

    connection.query<any, [number, number]>(
      `INSERT INTO recharges ("cardId", amount) VALUES ($1, $2)`,
      [cardId, amount]
    );
  }
}
