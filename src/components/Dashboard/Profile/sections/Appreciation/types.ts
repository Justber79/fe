import { ApiAppreciationGet } from "need4deed-sdk";

export type DeliveryStatus = "received" | "pending" | "post";
export type AppreciationWithStatus = ApiAppreciationGet & { status: DeliveryStatus };
