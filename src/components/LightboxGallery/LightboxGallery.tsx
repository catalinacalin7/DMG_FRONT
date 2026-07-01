import Lightbox, { ThumbnailsRef } from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import NextJsImage from "@/components/LightboxGallery/NextJsImage";
import { useRef } from "react";
type LightboxGallery = {
  open: boolean;
  setOpen: (close: boolean) => void;
  images: Image[];
};

type Image = {
  src: string;
  width: number;
  height: number;
};

const LightboxGallery = ({ open, setOpen, images }: LightboxGallery) => {
  const thumbnailsRef = useRef<ThumbnailsRef>(null);
  return (
    <Lightbox
      open={open}
      close={() => setOpen(false)}
      slides={images}
      render={{ slide: NextJsImage }}
      plugins={[Thumbnails]}
      thumbnails={{
        ref: thumbnailsRef,
        position: "bottom",
        width: 50,
        height: 50,
        border: 1,
        gap: 16,
      }}
      on={{
        click: () => {
          (thumbnailsRef.current?.visible
            ? thumbnailsRef.current?.hide
            : thumbnailsRef.current?.show)?.();
        },
      }}
    />
  );
};

export default LightboxGallery;
