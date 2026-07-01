"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { getMember, getMembers, updateMember } from "@/api/company/members";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { UpdateMemberDto } from "@/types/company";
import TextInput from "@/components/inputs/TextInput";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { useTranslations } from "next-intl";
import DateOfBirthPicker from "@/components/inputs/DateOfBirthPicker";
import { Form } from "@/components/ui/form";
import SelectInput from "@/components/inputs/SelectInput";
import { Camera, TrashIcon } from "lucide-react";
import LightboxGallery from "@/components/LightboxGallery/LightboxGallery";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

const memberSchema = yup.object().shape({
  name: yup.string().required("Field is required"),
  email: yup.string().required("Field is required"),
  role: yup.string().required("Field is required"),
  companyName: yup.string().optional(),
  nin: yup.string().optional(),
  aOne: yup.string().optional(),
  taxID: yup.string().optional(),
  iban: yup.string().optional(),
  bic: yup.string().optional(),
  bankName: yup.string().optional(),
  dateOfBirth: yup.date().optional(),
  phone: yup.string().required("Field is required"),
  address: yup.string().optional(),
  salaryPercentage: yup.number(),
  salaryFixed: yup.number(),
});

const defaultFormValues = {
  name: "",
  email: "",
  role: "",
  companyName: "",
  nin: "",
  aOne: "",
  taxID: "",
  iban: "",
  bic: "",
  bankName: "",
  dateOfBirth: new Date(),
  phone: "",
  address: "",
  salaryPercentage: 0,
  salaryFixed: 0,
};

const EditTeamMemberForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const [imagePreview, setImagePreview] = useState<any>();
  const [openLightbox, setOpenLightbox] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tCompany = useTranslations("Settings.CompanyPayment");
  const tActions = useTranslations("ToastActions");
  const tNav = useTranslations("Navigation");
  const t = useTranslations("Settings.Team");
  const tUI = useTranslations("ui");
  const tAuth = useTranslations("Auth");

  const { id: memberId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: teamMember, isLoading: isLoadingUserData } = useQuery({
    queryKey: [QUERY_KEYS.teamMember, memberId],
    queryFn: () => getMember(+memberId),
  });

  const currentMemberData = {
    name: teamMember?.user?.name || "",
    email: teamMember?.user?.email || "",
    nin: teamMember?.nin || "",
    aOne: teamMember?.aOne || "",
    companyName: teamMember?.companyName || "",
    taxID: teamMember?.taxID || "",
    address: teamMember?.address || "",
    iban: teamMember?.iban || "",
    bic: teamMember?.bic || "",
    bankName: teamMember?.bankName || "",
    dateOfBirth: teamMember?.dateOfBirth
      ? new Date(teamMember.dateOfBirth)
      : new Date(),
    phone: teamMember?.phone || "",
    salaryPercentage: teamMember?.salaryPercentage || 0,
    salaryFixed: teamMember?.salaryFixed || 0,
    role: teamMember?.user?.role || "",
  };

  const form = useForm({
    defaultValues: defaultFormValues,
    values: currentMemberData,
    resolver: yupResolver(memberSchema),
  });

  useEffect(() => {
    if (teamMember?.idImage) {
      setImagePreview(teamMember.idImage);
    }
    return () => {
      setImagePreview(null);
    };
  }, [teamMember?.idImage]);

  const submitFormMutation = useMutation({
    mutationFn: async (data: UpdateMemberDto) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (selectedFile) {
        formData.append("id-image", selectedFile);
      }
      await updateMember(formData as any, Number(memberId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.members, QUERY_KEYS.teamMember],
      });
      toast.success(tNav("team"), {
        description: tActions("created"),
      });
      router.push(`/settings/team`);
    },
    onError: () => {
      toast.error(tNav("team"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    const previewUrl = URL.createObjectURL(file as any);
    setImagePreview(previewUrl);
  };

  const handleCancelImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoadingUserData) return <LoadingScreen />;

  return (
    <Form {...form}>
      <>
        <form
          onSubmit={form.handleSubmit((values) =>
            submitFormMutation.mutate(values as UpdateMemberDto),
          )}
          className="flex h-full flex-col justify-between overflow-y-auto"
        >
          <div className="flex flex-col">
            <FormInputWrapper>
              <div className="grid w-full grid-cols-1 place-items-start justify-items-start lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
                <label className="text-nowrap text-[16px] font-semibold lg:pr-14">
                  Id image
                </label>
                {imagePreview ? (
                  <div className="relative h-[130px] w-full items-center md:h-[180px] lg:h-[180px] xl:h-[230px]">
                    <div
                      onClick={() => setOpenLightbox(true)}
                      className="h-full w-full cursor-pointer"
                    >
                      <img
                        alt="idImage"
                        src={imagePreview}
                        className="h-full w-full rounded-lg object-contain"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute right-2 top-2 h-8 w-8 p-1 drop-shadow-2xl"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (imagePreview) {
                          handleCancelImage();
                        }
                      }}
                    >
                      <TrashIcon size={20} className="text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative flex h-[130px] w-full cursor-pointer items-center justify-center rounded-lg bg-[#F8FAFC] px-4 py-4 md:h-[180px] lg:h-[180px] xl:h-[230px]">
                    <div className="flex w-full cursor-pointer flex-col items-center gap-2">
                      <Camera size={24} className="text-[#64748B]" />
                    </div>
                    <input
                      name="idImage"
                      type="file"
                      ref={fileInputRef}
                      className="absolute bottom-0 left-0 right-0 top-0 h-full w-full cursor-pointer opacity-0"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      multiple
                    />
                  </div>
                )}
              </div>
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput
                fieldName="email"
                fieldLabel={tAuth("email")}
                required
              />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput fieldName="name" fieldLabel={tAuth("name")} required />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput
                fieldName="companyName"
                fieldLabel={t("companyName")}
              />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput fieldName="nin" fieldLabel={t("id")} required />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput fieldName="aOne" fieldLabel={t("aOne")} required />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput fieldName="taxID" fieldLabel={t("taxID")} />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput fieldName="iban" fieldLabel={tCompany("iban")} />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput fieldName="bic" fieldLabel={tCompany("bic")} />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput
                fieldName="bankName"
                fieldLabel={tCompany("bankName")}
              />
            </FormInputWrapper>
            <FormInputWrapper>
              <DateOfBirthPicker
                fieldName="dateOfBirth"
                fieldLabel={t("dateOfBirth")}
              />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput fieldName="phone" fieldLabel={t("phone")} required />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput fieldName="address" fieldLabel={t("address")} />
            </FormInputWrapper>

            <FormInputWrapper>
              <TextInput
                fieldName="salaryPercentage"
                fieldLabel={t("salaryPercentage")}
                required
              />
            </FormInputWrapper>
            <FormInputWrapper>
              <TextInput
                fieldName="salaryFixed"
                fieldLabel={t("salaryFixed")}
                required
              />
            </FormInputWrapper>
            <FormInputWrapper>
              <SelectInput
                fieldName="role"
                fieldLabel={t("role")}
                options={[
                  { label: t("manager"), value: "MANAGER" },
                  { label: t("sales_manager"), value: "SALES_MANAGER" },
                  { label: t("technician"), value: "TECHNICIAN" },
                ]}
              />
            </FormInputWrapper>
          </div>
          <div className="flex items-center justify-end gap-2 py-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => router.push(`/settings/team`)}
            >
              {tUI("buttons.cancel")}
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={submitFormMutation.isPending}
            >
              {tUI("buttons.save")}
            </Button>
          </div>
        </form>
        <LightboxGallery
          images={
            imagePreview
              ? [imagePreview]?.map((image) => {
                  return {
                    src: image,
                    title: "",
                    width: 3000,
                    height: 3000,
                  };
                })
              : []
          }
          open={openLightbox}
          setOpen={() => setOpenLightbox(false)}
        />
      </>
    </Form>
  );
};

export default EditTeamMemberForm;
