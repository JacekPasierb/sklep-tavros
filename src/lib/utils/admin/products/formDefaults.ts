import {
  ColorRow,
  ImgInput,
  SectionInput,
  Size,
  SIZES,
} from "../../../../types/admin/productForm";

export const emptyImg = (): ImgInput => ({src: ""});

export const emptySection = (): SectionInput => ({title: "", itemsText: ""});

export const emptyColorRow = (): ColorRow => ({
  color: "",
  skuPrefix: "",
  stockBySize: SIZES.reduce((acc, s) => {
    acc[s] = "0";
    return acc;
  }, {} as Record<Size, string>),
});
