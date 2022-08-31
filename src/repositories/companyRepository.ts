import { connection } from "../dbStrategy/postgres/connection";
import { Company } from "../interfaces/companyInterfaces";

export async function findByApiKey(apiKey: string) {
  const result = await connection.query<Company, [string]>(
    `SELECT * FROM companies WHERE "apiKey"=$1`,
    [apiKey]
  );

  return result.rows[0];
}
