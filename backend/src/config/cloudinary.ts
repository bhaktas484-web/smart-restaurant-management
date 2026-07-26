import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a base64 or local file path to Cloudinary under a namespaced folder.
 * Namespacing by folder (e.g. "restaurant-saas/menu-items") keeps assets
 * organized and makes it easy to purge/manage by category later.
 */
export async function uploadToCloudinary(
  filePathOrBase64: string,
  folder: "menu-items" | "avatars" | "restaurant-logos" | "misc" = "misc"
) {
  const result = await cloudinary.uploader.upload(filePathOrBase64, {
    folder: `restaurant-saas/${folder}`,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteFromCloudinary(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
