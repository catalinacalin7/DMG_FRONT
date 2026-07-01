import axios from "axios";

interface CarInfo {
  vin: string;
  year: string;
  model: string;
  make: string;
  engine: string;
  doors: string;
  fuelType: string;
  vehicleType: string;
}

// Define the full API response structure
interface DecodeVinResponse {
  Results: Array<{ [key: string]: string }>;
}

export const getCarsByMake = async (
  search?: string,
  page: number = 1,
  limit: number = 20,
) => {
  try {
    const offset = (page - 1) * limit;

    const { data } = await axios.get(
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records",
      {
        params: {
          select: "make",
          where: `suggest(*, "${search}")`,
          group_by: "make",
        },
      },
    );

    return data as {
      total_count?: number;
      results: { [key: string]: string }[];
    };
  } catch (err) {
    throw err;
  }
};

export const getCarsModelsByMake = async (
  search?: string,
  selectedMake?: string,
  page: number = 1,
  limit: number = 20,
) => {
  try {
    let whereQuery = "";

    if (selectedMake) {
      whereQuery = `make="${selectedMake}"`;
    }

    if (search && selectedMake) {
      whereQuery = `make="${selectedMake}" AND search(model, "${search}")`;
    }

    const offset = (page - 1) * limit;

    const { data } = await axios.get(
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records",
      {
        params: {
          select: "model",
          where: whereQuery,
          group_by: "model",
          limit: limit.toString(),
          offset: offset.toString(),
        },
      },
    );

    return data as {
      total_count?: number;
      results: { [key: string]: string }[];
    };
  } catch (err) {
    throw err;
  }
};

export const getCarByVin = async (vinNumber: string): Promise<CarInfo> => {
  try {
    const { data } = await axios.get<DecodeVinResponse>(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vinNumber}`,
      {
        params: { format: "json" },
      },
    );

    if (!data.Results || data.Results.length === 0) {
      throw new Error("Invalid VIN or no data available");
    }

    const result = data.Results[0];

    return {
      vin: result.VIN || "",
      year: result.ModelYear || "",
      model: result.Model || "",
      make: result.Make || "",
      engine: result.DisplacementCC,
      doors: result.Doors || "",
      fuelType: result?.FuelTypePrimary?.toLowerCase() || "",
      vehicleType: result.BodyClass
        ? result.BodyClass.split("/")[0].toLowerCase()
        : "",
    };
  } catch (error) {
    throw new Error(`Failed to fetch car data: ${(error as Error).message}`);
  }
};
