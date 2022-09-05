import { CardRepository } from "../../repositories/cardRepository";
import { CompanyRepository } from "../../repositories/companyRepository";
import { EmployeeRepository } from "../../repositories/employeeRepository";
import { PaymentRepository } from "../../repositories/paymentRepository";
import { RechargeRepository } from "../../repositories/rechargeRepository";
import { CardUtils } from "../../utils/cardUtils";
import { CryptDataUtils } from "../../utils/cryptDataUtils";
import { ActivateCardService } from "./activateCardService";
import { BlockCardService } from "./blockCardService";
import { CardValidator } from "./cardsServicesValidators";
import { CreateCardService } from "./createCardService";
import { GetCardBalanceService } from "./getCardBalanceService";
import { RechargeCardService } from "./rechargeCardService";
import { UnblockCardService } from "./unblockCardService";

const cardValidator = new CardValidator();

const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);
const cardUtils = new CardUtils();

const cardRepository = new CardRepository();
const companyRepository = new CompanyRepository();
const employeeRepository = new EmployeeRepository();
const rechargeRepository = new RechargeRepository();
const paymentRepository = new PaymentRepository();

export const createCardService = new CreateCardService(
  cardValidator,
  cryptDataUtils,
  cardUtils,
  cardRepository,
  companyRepository,
  employeeRepository
);

export const activateCardService = new ActivateCardService(
  cardValidator,
  cryptDataUtils,
  cardUtils,
  cardRepository
);

export const blockCardService = new BlockCardService(
  cardValidator,
  cardUtils,
  cryptDataUtils,
  cardRepository
);

export const unblockCardService = new UnblockCardService(
  cardValidator,
  cardUtils,
  cryptDataUtils,
  cardRepository
);

export const getBalanceService = new GetCardBalanceService(
  cardValidator,
  cardUtils,
  cardRepository,
  rechargeRepository,
  paymentRepository
);

export const rechargeCardService = new RechargeCardService(
  cardValidator,
  cardUtils,
  cardRepository,
  rechargeRepository,
  companyRepository
);
