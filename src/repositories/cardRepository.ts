import { connection } from "../dbStrategy/postgres/connection";
import { Card } from "../interfaces/cardInterfaces";
import { TransactionTypes } from "../types/cardTypes";
import { mapObjectToUpdateQuery } from "../utils/sqlUtils";

type CardInsertData = Omit<Card, "id">;
type CardUpdateData = Partial<Card>;

type CardId = {
  cardId: number;
};

interface InsertResult {
  rows: CardId[];
}

export interface CardRepositoryInterface {
  insert: (cardData: CardInsertData) => Promise<number>;
  find: () => Promise<Card[]>;
  findById: (id: number) => Promise<Card>;
  findByTypeAndEmployeeId: (
    type: TransactionTypes,
    employeeId: number
  ) => Promise<Card>;
  findByCardDetails: (
    number: string,
    cardholderName: string,
    expirationDate: string
  ) => Promise<Card>;
  update: (id: number, cardData: CardUpdateData) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export class CardRepository implements CardRepositoryInterface {
  async insert(cardData: CardInsertData): Promise<number> {
    const {
      employeeId,
      number,
      cardholderName,
      securityCode,
      expirationDate,
      password,
      isVirtual,
      originalCardId,
      isBlocked,
      type,
    } = cardData;

    const {
      rows: [{ cardId }],
    }: InsertResult = await connection.query(
      `
      INSERT INTO cards ("employeeId", number, "cardholderName", "securityCode",
        "expirationDate", password, "isVirtual", "originalCardId", "isBlocked", type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id AS "cardId"
    `,
      [
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password,
        isVirtual,
        originalCardId,
        isBlocked,
        type,
      ]
    );

    return cardId;
  }

  async find(): Promise<Card[]> {
    const result = await connection.query<Card>("SELECT * FROM cards");
    return result.rows;
  }

  async findById(id: number): Promise<Card> {
    const result = await connection.query<Card, [number]>(
      "SELECT * FROM cards WHERE id=$1",
      [id]
    );
    return result.rows[0];
  }

  async findByTypeAndEmployeeId(
    type: TransactionTypes,
    employeeId: number
  ): Promise<Card> {
    const result = await connection.query<Card, [TransactionTypes, number]>(
      `SELECT * FROM cards WHERE type=$1 AND "employeeId"=$2`,
      [type, employeeId]
    );
    return result.rows[0];
  }

  async findByCardDetails(
    number: string,
    cardholderName: string,
    expirationDate: string
  ): Promise<Card> {
    const result = await connection.query<Card, [string, string, string]>(
      ` SELECT 
          * 
        FROM cards 
        WHERE number=$1 AND "cardholderName"=$2 AND "expirationDate"=$3`,
      [number, cardholderName, expirationDate]
    );
    return result.rows[0];
  }

  async update(id: number, cardData: CardUpdateData): Promise<void> {
    const { objectColumns: cardColumns, objectValues: cardValues } =
      mapObjectToUpdateQuery({
        object: cardData,
        offset: 2,
      });

    connection.query(
      `
      UPDATE cards
        SET ${cardColumns}
      WHERE $1=id
    `,
      [id, ...cardValues]
    );
  }

  async remove(id: number): Promise<void> {
    connection.query<any, [number]>("DELETE FROM cards WHERE id=$1", [id]);
  }
}
