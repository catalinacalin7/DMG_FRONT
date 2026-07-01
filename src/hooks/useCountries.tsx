import { useEffect, useState } from "react";
import { countries } from "countries-list";

const useCountries = () => {
  const [list, setList] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (countries && Object.values(countries) != undefined) {
      const countryList = Object.values(countries).map((item) => {
        return { label: item.name, value: item.name };
      });
      setList(countryList);
    }
  }, []);
  return list;
};

export default useCountries;
