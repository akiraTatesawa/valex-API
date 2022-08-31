import * as CompanyRepository from "../repositories/companyRepository";
import * as EmployeeRepository from "../repositories/employeeRepository";
import * as CardRepository from "../repositories/cardRepository";
import * as CardUtils from "../utils/cardUtils";
import { CustomError } from "../classes/CustomError";
import { Card } from "../classes/Card";
import { TransactionTypes } from "../types/cardTypes";

export async function createNewCard(
  API_KEY: string,
  employeeId: number,
  cardType: TransactionTypes
) {
  const company = await CompanyRepository.findByApiKey(API_KEY);
  if (!company) {
    throw new CustomError("error_not_found", "Company not found");
  }

  const employee = await EmployeeRepository.findById(employeeId);
  if (!employee) {
    throw new CustomError("error_not_found", "Employee not found");
  }

  const existingCard = await CardRepository.findByTypeAndEmployeeId(
    cardType,
    employeeId
  );
  if (existingCard) {
    throw new CustomError(
      "error_conflict",
      `The employee already has a ${cardType} card`
    );
  }
  const cardholderName = CardUtils.setCardholderName(employee.fullName);

  const card = new Card(employeeId, cardType, cardholderName);

  await CardRepository.insert(card);
}
