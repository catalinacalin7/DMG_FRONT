import { WorkflowItem } from "@/api/workflow/workflow";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Dot as DotIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type WorkflowCardProps = {
  item: WorkflowItem;
};

const WorkflowCard = ({ item }: WorkflowCardProps) => {
  const [position, setPosition] = useState(item.status);

  return (
    <Card className="p-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">{item.companyMember.user.name}</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex h-6 items-center justify-start gap-2 border-0",
                {
                  "bg-blue-100": item.status === "NEW",
                  "text-blue-300": item.status === "NEW",
                  "bg-yellow-100": item.status === "IN_PROGRESS",
                  "text-yellow-300": item.status === "IN_PROGRESS",
                  "bg-green-100": item.status === "COMPLETED",
                  "text-green-300": item.status === "COMPLETED",
                },
              )}
            >
              <DotIcon size={32} className="h-auto w-fit p-0" />
              <span className="text-xs font-semibold">{item.status}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="NEW">NEW</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="IN_PROGESS">
                IN PROGRESS
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="COMPLETED">
                COMPLETED
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator className="my-2" />
      <div className="flex items-center justify-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-gray-300"></div>
        <div className="flex flex-col">
          <div className="flex items-center justify-start gap-2">
            <p className="text-sm font-semibold text-gray-300">Vehicle</p>
            <p className="font-semibold">
              {item.vehicle.make} {item.vehicle.model} {item.vehicle.year}
            </p>
          </div>
          <div className="flex items-center justify-start gap-2">
            <p className="text-sm font-semibold text-gray-300">Vin</p>
            <p className="font-semibold">{item.vehicle.vinNumber}</p>
          </div>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-gray-300">Service</p>
        <p className="font-semibold">{item.serviceName}</p>
      </div>
    </Card>
  );
};

export default WorkflowCard;
