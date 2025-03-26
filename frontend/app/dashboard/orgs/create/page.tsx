"use client";
import { useRouter } from "next/navigation";
import AuthSuspense from "@/components/auth/AuthSuspense";
import ToastManager from "@/components/toast/ToastManager";
import { createOrg } from "@/api/orgs";
import { uploadImage } from "@/api/uploadImage";
import OrgForm from "../_components/OrgForm";

export default function CreateOrgPage() {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    try {
      let imageUrl = null;
      if (formData.pending_upload_img) {
        try {
          imageUrl = await uploadImage(formData.pending_upload_img);
        } catch (error) {
          console.error("Error uploading image:", error);
          ToastManager.addToast(
            "Failed to upload image. Please try again.",
            "error",
            3000
          );
          throw error;
        }
      }

      await createOrg({
        ...formData,
        org_icon: imageUrl || formData.org_icon,
        org_verified: false,
        org_reputation: 0
      });
      
      ToastManager.addToast(
        "Organization created successfully!",
        "success",
        3000
      );
      router.push("/dashboard/orgs");
    } catch (error) {
      console.error("Error creating organization:", error);
      ToastManager.addToast(
        "Failed to create organization. Please try again.",
        "error",
        3000
      );
      throw error;
    }
  };

  return (
    <AuthSuspense>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Organization</h1>
          <OrgForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard/orgs")}
          />
        </div>
      </div>
    </AuthSuspense>
  );
}
