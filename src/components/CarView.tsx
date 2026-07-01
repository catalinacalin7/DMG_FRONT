import Image from "next/image";
import React from "react";

interface CarViewProps {
  title: string;
  vin: string;
  colorName: string;
  make: string;
  model: string;
  year: string;
  logo: string;
  carImg: string;
}

const CarView = ({
  title,
  carImg,
  colorName,
  logo,
  make,
  model,
  vin,
  year,
}: CarViewProps) => {
  return (
    <div className="flex h-full flex-col gap-7 px-4 py-6">
      <div className="flex items-center gap-4">
        <div className="rounded-[10px] bg-blue-100 p-[10px]">
          <Image src={logo} width={28} height={28} alt="car mark" />
        </div>

        <div className="flex flex-col justify-between">
          <h2 className="font-bold text-black">{title}</h2>

          <p className="text-sm font-medium text-gray-300">VIN: {vin}</p>
        </div>
      </div>

      <div className="self-center bg-[url('/clients/car-stand.svg')] bg-contain bg-bottom bg-no-repeat">
        <Image src={carImg} alt="tesla car" width={270} height={135} />
      </div>

      <div className="flex flex-col items-center gap-2 self-center">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500">
          <div className="z-10 h-6 w-6 rounded-full bg-[#F1F5F9]" />
        </div>

        <p className="text-xs font-medium text-gray-300">{colorName}</p>
      </div>

      <div className="flex gap-10 self-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold leading-9 text-black">{make}</h3>

          <p className="text-xs font-medium leading-5 text-gray-300">Make</p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold leading-9 text-black">{model}</h3>

          <p className="text-xs font-medium leading-5 text-gray-300">Model</p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold leading-9 text-black">{year}</h3>

          <p className="text-xs font-medium leading-5 text-gray-300">Year</p>
        </div>
      </div>
    </div>
  );
};

export default CarView;
