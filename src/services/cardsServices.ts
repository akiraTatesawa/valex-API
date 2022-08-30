import * as CompanyRepository from "../repositories/companyRepository";
import * as EmployeeRepository from "../repositories/employeeRepository";
import * as CardRepository from "../repositories/cardRepository";
import { CustomError } from "../utils/classesUtils";

export async function createNewCard(
  API_KEY: string,
  employeeId: number,
  cardType: CardRepository.TransactionTypes
) {
  const company = await CompanyRepository.findByApiKey(API_KEY);
  if (!company) {
    throw new CustomError("error_not_found", "Company not found");
  }

  const employee = await EmployeeRepository.findById(employeeId);
  if (!employee) {
    throw new CustomError("error_not_found", "Employee not found");
  }

  const card = await CardRepository.findByTypeAndEmployeeId(
    cardType,
    employeeId
  );
  if (card) {
    throw new CustomError(
      "error_conflict",
      `The employee already has a ${cardType} card`
    );
  }

  return { company, employee, card };
}
