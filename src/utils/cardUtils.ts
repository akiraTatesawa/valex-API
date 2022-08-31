export function setCardholderName(employeeName: string): string {
  const employeeNameArray: string[] = employeeName.split(" ");
  const cardholderNameArray: string[] = [];

  employeeNameArray.forEach((value, index, array) => {
    if (index === 0 || index === array.length - 1) {
      return cardholderNameArray.push(value.toUpperCase());
    }
    if (value.length > 3) {
      return cardholderNameArray.push(value.charAt(0).toUpperCase());
    }
    return null;
  });

  return cardholderNameArray.join(" ");
}
