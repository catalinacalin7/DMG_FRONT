"use client";

import AddVehicleForm from "@/features/client/garage/AddVehicleForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getVehicle } from "@/api/vehicles/vehicles";
import { QUERY_KEYS } from "@/constants/queryKeys";
import LoadingScreen from "@/components/LoadingScreen";

const EditVehiclePage = () => {
  const { vehicleId } = useParams();

  const { data: vehicleData, isLoading: isLoadingVehicle } = useQuery({
    queryKey: [QUERY_KEYS.garages, vehicleId],
    queryFn: () => getVehicle(vehicleId as string),
  });

  if (isLoadingVehicle) return <LoadingScreen />;
  return <AddVehicleForm vehicleData={vehicleData} />;
};

export default EditVehiclePage;
