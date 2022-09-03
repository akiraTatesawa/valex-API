import * as CardUtils from "../../utils/cardUtils";
import * as CryptDataUtils from "../../utils/cryptDataUtils";
import { CustomError } from "../../classes/CustomError";
import { Card as ICard } from "../../interfaces/cardInterfaces";
import { Company } from "../../interfaces/companyInterfaces";
import { Business } from "../../interfaces/businessInterfaces";
import { Employee } from "../../interfaces/employeeInterfaces";
import { TransactionTypes } from "../../types/cardTypes";

export interface CardValidatorInterface {
  ensureCompanyExists: (company: Company) => void;
  ensureBusinessExists: (business: Business) => void;
  ensureEmployeeExists: (employee: Employee) => void;
  ensureEmployeeDoesNotHaveThisCardType: (
    card: ICard,
    cardType: string
  ) => void;
  ensureCardExists: (card: ICard) => void;
  ensureCardIsNotActivated: (password: string | undefined) => void;
  ensureCardIsNotExpired: (expirationDate: string) => void;
  ensureSecurityCodeIsCorrect: (
    cardSecurityCode: string,
    reqCVC: string
  ) => void;
  ensureCardIsActivated: (password: string | undefined) => void;
  ensureCardIsUnblocked: (isBlocked: boolean) => void;
  ensureCardIsNotBlocked: (isBlocked: boolean) => void;
  ensureCardIsBlocked: (isBlocked: boolean) => void;
  ensurePasswordIsCorrect: (
    cardPassword: string | undefined,
    reqPassword: string
  ) => void;
  ensureBusinessTypeIsEqualToCardType: (
    businessType: TransactionTypes,
    cardType: TransactionTypes
  ) => void;
  ensureSufficientCardBalance: (balance: number, amount: number) => void;
  ensureCardIsNotVirtual: (isVirtual: boolean, service: string) => void;
  ensureCardIsVirtual: (isVirtual: boolean) => void;
}

export class CardValidator implements CardValidatorInterface {
  ensureCompanyExists(company: Company) {
    if (!company) {
      throw new CustomError("error_not_found", "Company not found");
    }
  }

  ensureBusinessExists(business: Business) {
    if (!business) {
      throw new CustomError("error_not_found", "Business not found");
    }
  }

  ensureEmployeeExists(employee: Employee) {
    if (!employee) {
      throw new CustomError("error_not_found", "Employee not found");
    }
  }

  ensureEmployeeDoesNotHaveThisCardType(card: ICard, cardType: string) {
    if (card) {
      throw new CustomError(
        "error_conflict",
        `The employee already has a ${cardType} card`
      );
    }
  }

  ensureCardExists(card: ICard) {
    if (!card) {
      throw new CustomError("error_not_found", "Card not found");
    }
  }

  ensureCardIsNotActivated(password: string | undefined) {
    if (password) {
      throw new CustomError(
        "error_bad_request",
        "This card is already activated"
      );
    }
  }

  ensureCardIsNotExpired(expirationDate: string) {
    if (CardUtils.setIsExpired(expirationDate)) {
      throw new CustomError("error_bad_request", "This card is expired");
    }
  }

  ensureSecurityCodeIsCorrect(cardSecurityCode: string, reqCVC: string) {
    if (CryptDataUtils.decryptData(cardSecurityCode) !== reqCVC) {
      throw new CustomError(
        "error_unauthorized",
        "Incorrect card security code"
      );
    }
  }

  ensureCardIsActivated(password: string | undefined) {
    if (!password) {
      throw new CustomError("error_bad_request", "This card is not activated");
    }
  }

  ensureCardIsUnblocked(isBlocked: boolean) {
    if (isBlocked) {
      throw new CustomError(
        "error_bad_request",
        "This card is already blocked"
      );
    }
  }

  ensureCardIsNotBlocked(isBlocked: boolean) {
    if (isBlocked) {
      throw new CustomError("error_bad_request", "This card is blocked");
    }
  }

  ensureCardIsBlocked(isBlocked: boolean) {
    if (!isBlocked) {
      throw new CustomError("error_bad_request", "This card is not blocked");
    }
  }

  ensurePasswordIsCorrect(
    cardPassword: string | undefined,
    reqPassword: string
  ) {
    if (
      cardPassword &&
      CryptDataUtils.decryptData(cardPassword) !== reqPassword
    ) {
      throw new CustomError("error_unauthorized", "Incorrect password");
    }
  }

  ensureBusinessTypeIsEqualToCardType(
    businessType: TransactionTypes,
    cardType: TransactionTypes
  ) {
    if (businessType !== cardType) {
      throw new CustomError(
        "error_bad_request",
        "The business type does not match the card type"
      );
    }
  }

  ensureSufficientCardBalance(balance: number, amount: number) {
    if (balance < amount) {
      throw new CustomError("error_bad_request", "Insufficient card balance");
    }
  }

  ensureCardIsNotVirtual(isVirtual: boolean, service: string) {
    if (isVirtual) {
      throw new CustomError(
        "error_bad_request",
        `The ${service} service is not available for virtual cards`
      );
    }
  }

  ensureCardIsVirtual(isVirtual: boolean) {
    if (!isVirtual) {
      throw new CustomError("error_bad_request", "This is not a virtual card");
    }
  }
}
