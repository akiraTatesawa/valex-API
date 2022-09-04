import { connection } from "../dbStrategy/postgres/connection";
import { Payment } from "../interfaces/paymentInterfaces";

export type PaymentWithBusinessName = Payment & { businessName: string };
export type PaymentInsertData = Omit<Payment, "id" | "timestamp">;

export interface PaymentRepositoryInterface {
  findByCardId: (cardId: number) => Promise<PaymentWithBusinessName[]>;
  insert: (paymentData: PaymentInsertData) => Promise<void>;
}

export class PaymentRepository implements PaymentRepositoryInterface {
  async findByCardId(cardId: number): Promise<PaymentWithBusinessName[]> {
    const result = await connection.query<PaymentWithBusinessName, [number]>(
      `SELECT 
        payments.*,
        businesses.name as "businessName"
       FROM payments 
        JOIN businesses ON businesses.id=payments."businessId"
       WHERE "cardId"=$1
      `,
      [cardId]
    );

    return result.rows;
  }

  async insert(paymentData: PaymentInsertData): Promise<void> {
    const { cardId, businessId, amount } = paymentData;

    connection.query<any, [number, number, number]>(
      `INSERT INTO payments ("cardId", "businessId", amount) VALUES ($1, $2, $3)`,
      [cardId, businessId, amount]
    );
  }
}
