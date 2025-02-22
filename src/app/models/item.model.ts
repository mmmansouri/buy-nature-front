import {UUID} from "node:crypto";

export interface Item {
  id: UUID;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
