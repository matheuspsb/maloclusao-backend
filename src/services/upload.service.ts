import { cloudinary } from "../config/cloudinary";
import { AppError } from "../utils/AppError";

export class UploadService {
  async uploadImage(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "maloclusao/patients",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
        (error, result) => {
          if (error || !result) {
            reject(new AppError("Failed to upload image", 500));
            return;
          }
          resolve(result.secure_url);
        }
      );

      stream.end(fileBuffer);
    });
  }

  async deleteImage(url: string): Promise<void> {
    const publicId = this.extractPublicId(url);
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  }

  private extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
  }
}
