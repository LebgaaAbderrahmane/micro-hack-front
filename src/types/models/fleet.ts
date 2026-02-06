import { Database } from "../database.types";

export type Truck = Database["public"]["Tables"]["trucks"]["Row"];
export type Driver = Database["public"]["Tables"]["drivers"]["Row"];

export type TruckStatus = Database["public"]["Enums"]["truck_status_enum"];
export type DriverStatus = Database["public"]["Enums"]["driver_status_enum"];
