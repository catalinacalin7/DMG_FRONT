import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Search, Trash2 } from "lucide-react";

import { getAllClients } from "@/api/client/get-all";
import LoadingScreen from "@/components/LoadingScreen";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { BusinessClientData } from "@/types/clients";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { deleteClient } from "@/api/client/delete";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";

const ClientsList = ({
  clientType,
}: {
  clientType: "BUSINESS" | "PRIVATE";
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDebounced] = useDebounce(searchQuery, 2000);
  const tButton = useTranslations("ui");
  const t = useTranslations("PageClients");
  const tUI = useTranslations("ui");

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const canResetFilters = searchQuery;

  const {
    data: clients,
    isLoading: isLoadingClients,
    refetch: refetchClients,
  } = useQuery({
    queryKey: [QUERY_KEYS.clients, clientType],
    queryFn: async () =>
      getAllClients({
        searchQuery: searchQueryDebounced,
        clientType: clientType,
      }),
    enabled: !!clientType,
  });

  useEffect(() => {
    setSearchQuery("");
  }, [clientType]);

  useEffect(() => {
    refetchClients();
  }, [searchQueryDebounced, clientType, refetchClients]);

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteClient(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.clients],
      });
      toast({
        title: t("deleteClient"),
        description: t("deleteClientSuccess"),
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: t("deleteClient"),
        description: t("deleteClientError"),
        variant: "destructive",
      });
    },
  });

  const resetFilters = () => {
    setSearchQuery("");
  };

  const handleDelete = (id: string) => {
    deleteClientMutation.mutate(id);
  };

  if (isLoadingClients) return <LoadingScreen />;

  return (
    <div className="flex h-full flex-col justify-between gap-4 pt-5">
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex w-full gap-3 md:max-w-[300px]">
          <Input
            name="search"
            placeholder={tButton("placeholders.search")}
            startIcon={<Search className="h-5 w-5 text-gray-300" />}
            className="h-10 rounded-md text-sm placeholder:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex justify-start">
          {canResetFilters && (
            <div>
              <Button
                variant="ghost"
                className="w-full text-left text-blue-300"
                type="button"
                onClick={resetFilters}
              >
                {tUI("buttons.resetFilters")}
              </Button>
            </div>
          )}
        </div>
      </div>
      {clients ? (
        clients.map((item: BusinessClientData, index: number) => (
          <div
            key={item.id + index}
            className="flex items-center justify-between rounded-lg border px-4 py-5 shadow-sm"
          >
            <div>
              <h3 className="flex items-center text-base font-medium text-black">
                {item.name}
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-4 lg:justify-end lg:gap-2 xl:flex-nowrap">
              <Button size={"sm"} variant={"secondary"}>
                <Link key={item.name} href={`/clients/${item?.id}`}>
                  <Eye size={18} />
                </Link>
              </Button>
              <Button
                size={"sm"}
                variant={"secondary"}
                onClick={(e) => {
                  setItemId(item.id);
                  setDialogOpen(true);
                }}
              >
                <Trash2 size={18} className="text-red-500" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground text-center">
          {t(`no${clientType.toLowerCase()}Clients`)}
        </div>
      )}
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                {t("deleteClient")}
              </DialogTitle>
              <DialogDescription className="py-6 text-center text-base">
                {t("areYouSureDeleteClient")}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-row items-center justify-center gap-2 py-8 sm:flex sm:justify-center">
              <DialogClose asChild>
                <Button type="button" variant={"secondary"} size={"sm"}>
                  {tUI("buttons.cancel")}
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant={"destructive"}
                size={"sm"}
                onClick={() => {
                  setDialogOpen(false);
                  handleDelete(itemId as string);
                  setItemId(null);
                }}
              >
                {tUI("buttons.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClientsList;
