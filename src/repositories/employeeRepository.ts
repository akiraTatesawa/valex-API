import { connection } from "../dbStrategy/postgres/connection";
import { Employee } from "../interfaces/employeeInterfaces";

export async function findById(id: number) {
  const result = await connection.query<Employee, [number]>(
    "SELECT * FROM employees WHERE id=$1",
    [id]
  );

  return result.rows[0];
}
