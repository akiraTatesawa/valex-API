import { Card } from "../../classes/Card";
import { ResponseCard } from "../../interfaces/cardInterfaces";
import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { TransactionTypes } from "../../types/cardTypes";
import { CardValidatorInterface } from "./cardsServicesValidators";
import { CompanyRepositoryInterface } from "../../repositories/companyRepository";
import { EmployeeRepositoryInterface } from "../../repositories/employeeRepository";
import { CardUtils } from "../../utils/cardUtils";
import { CryptDataUtils } from "../../utils/cryptDataUtils";

export interface CreateCardServiceInterface {
  create: (
    API_KEY: string,
    employeeId: number,
    cardType: TransactionTypes
  ) => Promise<ResponseCard>;
}

export class CreateCardService implements CreateCardServiceInterface {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardRepository: CardRepositoryInterface,
    private companyRepository: CompanyRepositoryInterface,
    private employeeRepository: EmployeeRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardRepository = cardRepository;
    this.companyRepository = companyRepository;
    this.employeeRepository = employeeRepository;
  }

  async create(
    API_KEY: string,
    employeeId: number,
    cardType: TransactionTypes
  ): Promise<ResponseCard> {
    const company = await this.companyRepository.findByApiKey(API_KEY);
    this.cardValidator.ensureCompanyExists(company);

    const employee = await this.employeeRepository.findById(employeeId);
    this.cardValidator.ensureEmployeeExists(employee);

    const existingCard = await this.cardRepository.findByTypeAndEmployeeId(
      cardType,
      employeeId
    );
    this.cardValidator.ensureEmployeeDoesNotHaveThisCardType(
      existingCard,
      cardType
    );

    const cardUtils = new CardUtils();
    const cryptDataUtils = new CryptDataUtils();

    const cardholderName = cardUtils.setCardholderName(employee.fullName);

    console.log(cryptDataUtils.encryptData("zap"));

    const card = new Card(employeeId, cardType, cardholderName, cryptDataUtils);

    const resultCardId = await this.cardRepository.insert(card);

    return {
      cardId: resultCardId,
      number: card.number,
      cardholderName: card.cardholderName,
      securityCode: cryptDataUtils.decryptData(card.securityCode),
      expirationDate: card.expirationDate,
      type: card.type,
    };
  }
}
