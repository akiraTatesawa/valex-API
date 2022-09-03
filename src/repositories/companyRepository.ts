import { connection } from "../dbStrategy/postgres/connection";
import { Company } from "../interfaces/companyInterfaces";

export async function findByApiKey(apiKey: string) {
  const result = await connection.query<Company, [string]>(
    `SELECT * FROM companies WHERE "apiKey"=$1`,
    [apiKey]
  );

  return result.rows[0];
}

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
