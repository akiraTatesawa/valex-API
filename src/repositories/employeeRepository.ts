import { connection } from "../dbStrategy/postgres/connection";
import { Employee } from "../interfaces/employeeInterfaces";

export interface EmployeeRepositoryInterface {
  findById: (id: number) => Promise<Employee>;
}

export class EmployeeRepository implements EmployeeRepositoryInterface {
  async findById(id: number): Promise<Employee> {
    const result = await connection.query<Employee, [number]>(
      "SELECT * FROM employees WHERE id=$1",
      [id]
    );

    return result.rows[0];
  }
}
