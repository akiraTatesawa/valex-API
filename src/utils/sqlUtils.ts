import { NewCard as ICard } from "../interfaces/cardInterfaces";

type UpdatedCard = Partial<ICard>;

type UpdateObject = {
  object: UpdatedCard;
  offset: number;
};

export function mapObjectToUpdateQuery({ object, offset = 1 }: UpdateObject) {
  const objectColumns = Object.keys(object)
    .map((key, index) => `"${key}"=$${index + offset}`)
    .join(",");
  const objectValues = Object.values(object);

  return { objectColumns, objectValues };
}
