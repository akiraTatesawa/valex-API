import { connection } from "../dbStrategy/postgres/connection";
import { Business } from "../interfaces/businessInterfaces";

export interface BusinessRepositoryInterface {
  findById: (id: number) => Promise<Business>;
}

export class BusinessRepository implements BusinessRepositoryInterface {
  async findById(id: number): Promise<Business> {
    const result = await connection.query<Business, [number]>(
      "SELECT * FROM businesses WHERE id=$1",
      [id]
    );

    return result.rows[0];
  }
}
