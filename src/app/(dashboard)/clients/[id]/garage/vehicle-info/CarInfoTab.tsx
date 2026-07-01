"use client";

import { useParams } from "next/navigation";
import { TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getVehicle } from "@/api/vehicles/vehicles";
import { QUERY_KEYS } from "@/constants/queryKeys";
import LoadingScreen from "@/components/LoadingScreen";
import { useTranslations } from "next-intl";

const CarInfoTab = () => {
  const tGarage = useTranslations("Garage");
  const { vehicleId } = useParams();

  const { data: vehicleData, isLoading: isLoadingVehicle } = useQuery({
    queryKey: [QUERY_KEYS.garages, vehicleId, "vehicleData"],
    queryFn: async () => await getVehicle(vehicleId as string),
  });

  if (isLoadingVehicle) {
    return <LoadingScreen />;
  }

  return (
    <TabsContent value="car-info" className="flex flex-1 flex-col gap-6">
      <div className="space-y-4">
        {vehicleData && (
          <div className="md:max-w-[500px]">
            <div className="grid grid-cols-1 items-baseline justify-center border-b border-b-gray-200 lg:grid-cols-2">
              <small>{tGarage("make")}</small>
              <h3 className="font-medium">{vehicleData?.make}</h3>
            </div>
            <div className="grid grid-cols-1 items-baseline justify-center border-b border-b-gray-200 lg:grid-cols-2">
              <small>{tGarage("model")}</small>
              <h3 className="font-medium">{vehicleData?.model}</h3>
            </div>
            <div className="grid grid-cols-1 items-baseline justify-center border-b border-b-gray-200 lg:grid-cols-2">
              <small>{tGarage("year")}</small>
              <h3 className="font-medium">{vehicleData?.year}</h3>
            </div>
            <div className="grid grid-cols-1 items-baseline justify-center border-b border-b-gray-200 lg:grid-cols-2">
              <small>{tGarage("vehicleType")}</small>
              <h3 className="font-medium">{vehicleData?.vehicleType}</h3>
            </div>
            <div className="grid grid-cols-1 items-baseline justify-center border-b border-b-gray-200 lg:grid-cols-2">
              <small>{tGarage("vinNumber")}</small>
              <h3 className="font-medium">{vehicleData?.vinNumber}</h3>
            </div>
            <div className="grid grid-cols-1 items-baseline justify-center border-b border-b-gray-200 lg:grid-cols-2">
              <small>{tGarage("engineCm3")}</small>
              <h3 className="font-medium">{vehicleData?.engine}</h3>
            </div>
            <div className="grid grid-cols-1 items-baseline justify-center border-b border-b-gray-200 lg:grid-cols-2">
              <small>{tGarage("odometer")}</small>
              <h3 className="font-medium">{vehicleData?.odometer}</h3>
            </div>
            <div className="grid grid-cols-1 items-baseline justify-center border-b border-b-gray-200 lg:grid-cols-2">
              <small>{tGarage("doors")}</small>
              <h3 className="font-medium">{vehicleData?.doors}</h3>
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default CarInfoTab;
