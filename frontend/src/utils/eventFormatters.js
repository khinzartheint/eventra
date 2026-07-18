export function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "Price unavailable";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "Price unavailable";
  }

  if (numericPrice <= 0) {
    return "Free";
  }

  return `฿${numericPrice.toLocaleString()}`;
}

export function formatEventDate(date) {
  if (!date) {
    return "Date to be announced";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}