import { ChevronLeft, Menu, House } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import HomeMenu from "@/components/HomeMenu";

function HeaderMobile({ pageTitle }: { pageTitle: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === "/home";
  return (
    <Sheet>
      <header
        className={`${isHomePage ? "fixed bg-white" : "bg-brand-dark text-white"} flex h-[75px] w-full items-center justify-between px-6 py-3`}
      >
        <div
          className={`${!isHomePage && "border border-solid"} rounded-full border-gray-300 p-1`}
        >
          {isHomePage ? (
            <House />
          ) : (
            <ChevronLeft onClick={() => router.back()} />
          )}
        </div>
        <span
          className={`${isHomePage ? "text-black" : "text-white"} text-md font-bold`}
        >
          {pageTitle}
        </span>
        <SheetTrigger className="rounded-full border border-solid border-gray-300 p-2">
          <Menu size={18} />
        </SheetTrigger>
      </header>
      <HomeMenu />
    </Sheet>
  );
}
export default HeaderMobile;
