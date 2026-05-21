import { ApiRepresentativeGet } from "need4deed-sdk";

export const formatAddress = (address: ApiRepresentativeGet["address"] | undefined) => {
  if (!address || typeof address !== "object") return "";

  const postcode = address.postcode && typeof address.postcode === "object" ? address.postcode.code : address.postcode;
  return [address.street, address.city, postcode].filter(Boolean).join(", ");
};

export const parseAddress = (addressString: string) => {
  const [street = "", city = "", postcode = ""] = addressString.split(",").map((part) => part.trim());
  return { street, city, postcode };
};
