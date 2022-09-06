import { BusinessRepository } from "../../repositories/businessRepository";
import { CardRepository } from "../../repositories/cardRepository";
import { PaymentRepository } from "../../repositories/paymentRepository";
import { RechargeRepository } from "../../repositories/rechargeRepository";
import { CardUtils } from "../../utils/cardUtils";
import { CryptDataUtils } from "../../utils/cryptDataUtils";
import { CardValidator } from "../cardServices/cardsServicesValidators";
import { OnlinePaymentService } from "./onlinePaymentService";
import { POSPaymentService } from "./posPaymentService";

const cardValidator = new CardValidator();

const cardUtils = new CardUtils();
const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);

const cardRepository = new CardRepository();
const rechargeRepository = new RechargeRepository();
const businessRepository = new BusinessRepository();
const paymentRepository = new PaymentRepository();

export const onlinePaymentService = new OnlinePaymentService(
  cardValidator,
  cryptDataUtils,
  cardUtils,
  cardRepository,
  businessRepository,
  rechargeRepository,
  paymentRepository
);

export const posPaymentService = new POSPaymentService(
  cardValidator,
  cryptDataUtils,
  cardUtils,
  cardRepository,
  businessRepository,
  rechargeRepository,
  paymentRepository
);
