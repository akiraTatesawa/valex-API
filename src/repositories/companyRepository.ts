import { connection } from "../dbStrategy/postgres/connection";
import { Company } from "../interfaces/companyInterfaces";

export interface CompanyRepositoryInterface {
  findByApiKey: (apiKey: string) => Promise<Company>;
}

export class CompanyRepository {
  async findByApiKey(apiKey: string): Promise<Company> {
    const result = await connection.query<Company, [string]>(
      `SELECT * FROM companies WHERE "apiKey"=$1`,
      [apiKey]
    );

    return result.rows[0];
  }
}
