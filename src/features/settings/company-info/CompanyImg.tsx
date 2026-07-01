import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { File } from "buffer";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "@/api/users/users";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { QUERY_KEYS } from "@/constants/queryKeys";

const validFileExtensions = {
  image: ["jpg", "png", "jpeg"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
}

const AvatarSchema = yup.object().shape({
  file: yup
    .mixed()
    .nullable()
    .test("file-type", "Not a valid image type", (value) => {
      if (!value) return true;
      const file = value as File;
      return isValidFileType(file.name.toLowerCase(), "image");
    })
    .test("file-size", "Max allowed size 50MB", (value) => {
      if (!value) return true;
      const file = value as File;
      return file.size < MAX_FILE_SIZE;
    }),
});

function CompanyImg({ companyAvatarSrc }: { companyAvatarSrc: string }) {
  const t = useTranslations("Settings.CompanyInfo");
  const tUI = useTranslations("ui");
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<any>();
  const [avatarPreview, setAvatarPreview] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      file: null,
    },
    resolver: yupResolver(AvatarSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("file", file);
    }
    const previewUrl = URL.createObjectURL(file as any);
    setAvatarPreview(previewUrl);
    form.trigger("file");
  };

  const uploadUserAvatar = useMutation({
    mutationFn: async (avatarFormData: FormData) =>
      await uploadAvatar(avatarFormData),
    onSuccess: () => {
      handleCancelUpload();
      toast({
        title: "Company Image",
        description: t("companyImageHasBeenUploaded"),
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.companyAvatar],
      });
    },
  });

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setAvatarPreview(null);
    form.clearErrors("file");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    uploadUserAvatar.mutate(formData);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex w-full items-start justify-start border-b border-gray-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex w-full flex-col justify-between xl:flex-row">
            <FormField
              control={form.control}
              name="file"
              render={({ formState }) => {
                return (
                  <FormItem className="grid w-full grid-cols-1 lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
                    <FormLabel className="flex flex-col items-start text-[16px] font-semibold">
                      {t("photo")}
                      <FormDescription className="text-nowrap">
                        {t("thisWillBeDisplayedOnProfile")}
                      </FormDescription>
                      <div className="h-6 text-red-500">
                        {form.formState.errors.file &&
                          form.formState.errors.file.message}
                      </div>
                    </FormLabel>
                    <div className="flex w-full flex-col items-center justify-center xl:flex-row">
                      <div className="relative flex cursor-pointer flex-col items-center justify-center">
                        <Avatar
                          className="h-24 w-24 border"
                          onClick={handleImageClick}
                        >
                          {avatarPreview ? (
                            <>
                              <AvatarImage
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="object-contain"
                              />
                            </>
                          ) : (
                            <AvatarImage
                              src={companyAvatarSrc}
                              loading="lazy"
                              className="object-contain"
                            />
                          )}
                          <AvatarFallback className="aspect-square! w-full rounded-lg bg-blue-100 object-cover font-medium text-blue-600"></AvatarFallback>
                        </Avatar>
                        <FormControl>
                          <Input
                            placeholder=""
                            type="file"
                            name="file"
                            className="hidden"
                            accept="image/*"
                            ref={(e) => {
                              form.register("file").ref(e);
                              fileInputRef.current = e;
                            }}
                            onChange={handleFileChange}
                            isError={!!formState.errors.file}
                          />
                        </FormControl>
                        <small className="h-6 text-gray-500">
                          {!!selectedFile && selectedFile.name}
                        </small>
                      </div>
                    </div>
                  </FormItem>
                );
              }}
            />

            {selectedFile && (
              <div className="flex justify-end gap-2 py-4 xl:justify-between xl:pt-0">
                <Button
                  size="lg"
                  variant={"secondary"}
                  onClick={handleCancelUpload}
                >
                  {tUI("buttons.cancel")}
                </Button>
                <Button size="lg" type="submit">
                  {tUI("buttons.save")}
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
export default CompanyImg;
