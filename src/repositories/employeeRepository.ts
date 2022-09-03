import { connection } from "../dbStrategy/postgres/connection";
import { Employee } from "../interfaces/employeeInterfaces";

export async function findById(id: number) {
  const result = await connection.query<Employee, [number]>(
    "SELECT * FROM employees WHERE id=$1",
    [id]
  );

  return result.rows[0];
}

export interface EmployeeRepositoryInterface {
  findById: (id: number) => Promise<Employee>;
}

export class EmployeeRepository implements EmployeeRepositoryInterface {
  async findById(id: number) {
    const result = await connection.query<Employee, [number]>(
      "SELECT * FROM employees WHERE id=$1",
      [id]
    );

    return result.rows[0];
  }
}
