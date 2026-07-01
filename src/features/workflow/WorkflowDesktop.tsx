"use client";

import { getAllClients, getClientsFor } from "@/api/client/get-all";
import { getMembers, getMembersFor } from "@/api/company/members";
import LoadingScreen from "@/components/LoadingScreen";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Workflows from "./Workflows";
import { useTranslations } from "next-intl";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";

const WorkflowDesktop = () => {
  const tButton = useTranslations("ui");
  const t = useTranslations("PageWorkflow");
  const [clientName, setClientName] = useState("");
  const [companyMember, setCompanyMember] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => await getClientsFor(),
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["members"],
    queryFn: async () => await getMembersFor(),
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      setSearchQuery(term);
    } else {
      setSearchQuery("");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  if (isLoadingClients || isLoadingMembers) {
    return <LoadingScreen />;
  }

  return (
    <div className="pt-8">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <FormInputWrapper>
          <Input
            type="search"
            className="h-10 rounded-sm"
            placeholder={tButton("placeholders.search")}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchQuery}
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <Select
            defaultValue={clientName}
            onValueChange={(value) => {
              setClientName(value);
              if (value === "All clients") {
                setClientName("");
              }
            }}
          >
            <SelectTrigger size="md" className="w-full">
              <SelectValue
                placeholder={tButton("placeholders.selectAClient")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"All clients"}>{t("allClients")}</SelectItem>
                {clients?.map((client, index) => {
                  return (
                    <SelectItem key={index} value={client.name ?? ""}>
                      {client.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormInputWrapper>
        <FormInputWrapper>
          <Select
            defaultValue={companyMember}
            onValueChange={(value) => {
              setCompanyMember(value);
              if (value === "All members") {
                setCompanyMember("");
              }
            }}
          >
            <SelectTrigger size="md" className="w-full">
              <SelectValue
                placeholder={tButton("placeholders.selectTeamMember")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"All members"}>{t("allMembers")}</SelectItem>
                {members?.map((member, index) => {
                  return (
                    <SelectItem key={index} value={member.user.name ?? ""}>
                      {member.user.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormInputWrapper>
      </div>
      <Workflows
        clientName={clientName}
        companyMember={companyMember}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default WorkflowDesktop;
