"use client";
import { useContext } from "react";
import { AbilityContext } from "@/lib/AbilityContext";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getFranceMatrix } from "@/api/matrices/france-hail-matrix";
import { getRandIMatrices } from "@/api/matrices/rAndi-matrix";
import { useQuery } from "@tanstack/react-query";
import { getHailMatrices } from "@/api/matrices/hail-matrix";
import MatrixTypeFilter from "./MatrixTypeFilter";
import { useSearchParams } from "next/navigation";
import TypeMatrixList from "./TypeMatrixList";
import { getFranceRemoveInstall } from "@/api/matrices/france-remove-install";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

function Matrix() {
  const searchParams = useSearchParams();
  const query = searchParams.get("matrix") || "all";

  const ability = useContext(AbilityContext);

  const { data: hailFranceMatrix, isLoading: isLoadingFranceHailMatrix } =
    useQuery({
      queryKey: [QUERY_KEYS.franceHail],
      queryFn: () => getFranceMatrix(),
    });

  const {
    data: franceRemoveInstallMatrix,
    isLoading: isLoadingFranceRemoveInstallMatrix,
  } = useQuery({
    queryKey: [QUERY_KEYS.franceRemoveInstallMatrix],
    queryFn: () => getFranceRemoveInstall(),
  });

  // const { data: rAndiMatrices, isLoading: isLoadingRandIMatrices } = useQuery({
  //   queryKey: [QUERY_KEYS.rAndiMatrices],
  //   queryFn: () => getRandIMatrices(),
  // });

  // const { data: hailMatrix, isLoading: isLoadingHailMatrix } = useQuery({
  //   queryKey: [QUERY_KEYS.hailMatrices],
  //   queryFn: () => getHailMatrices(),
  // });

  if (!ability.can("manage", "matrix")) {
    return <RestrictedAccessScreen />;
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex items-center justify-between">
        {/* <MatrixTypeFilter /> */}
      </div>

      {(query === "all" || query === "hail") && (
        <>
          <TypeMatrixList
            data={hailFranceMatrix}
            mainTag="hail-france"
            isLoading={isLoadingFranceHailMatrix}
            flag="fr"
          />
          {/* <TypeMatrixList
            data={hailMatrix}
            mainTag="hail"
            isLoading={isLoadingHailMatrix}
            flag="de"
          /> */}
        </>
      )}
      {(query === "all" || query === "r-and-i") && (
        <>
          {/* <TypeMatrixList
            data={rAndiMatrices}
            mainTag="randi"
            isLoading={isLoadingRandIMatrices}
            flag="de"
          /> */}
          <TypeMatrixList
            data={franceRemoveInstallMatrix}
            mainTag="france-remove-install"
            isLoading={isLoadingFranceRemoveInstallMatrix}
            flag="fr"
          />
        </>
      )}
    </div>
  );
}
export default Matrix;
