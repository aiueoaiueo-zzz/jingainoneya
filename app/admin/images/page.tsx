import type { Metadata } from "next";
import { ImagesAdmin } from "@/components/admin/ImagesAdmin";

export const metadata: Metadata = { title: "画像" };

export default function AdminImagesPage() {
  return <ImagesAdmin />;
}
