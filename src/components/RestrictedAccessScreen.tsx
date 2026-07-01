import Image from "next/image";

function RestrictedAccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="py-4 text-xl font-bold text-red-600">
        You don&apos;t have permission. Contact Administrator
      </div>
      <div className="flex items-center justify-center">
        <Image src={"/emaster.svg"} width={150} height={150} alt="logo" />
      </div>
    </div>
  );
}
export default RestrictedAccessScreen;
