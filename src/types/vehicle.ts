export interface VehicleData {
  id?: string;
  vehicleType: string;
  vinNumber: string;
  make: string;
  model: string;
  registrationNumber: string;
  year: number;
  engine: string;
  doors: string;
  odometer: string;
  fuel: string;
  vehicleImages?: { id: number; url: string }[] | null;
}

export interface VehicleImage {
  id: string;
  url: string;
}
