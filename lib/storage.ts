import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';

const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
const endpoint = process.env.R2_ENDPOINT_URL || process.env.AWS_ENDPOINT_URL_S3;
const region = process.env.R2_REGION || process.env.AWS_REGION || 'auto';
const bucket = process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET || process.env.NEON_STORAGE_BUCKET || process.env.AWS_BUCKET_NAME || 'nokhba';
const publicDomain = process.env.R2_PUBLIC_URL || process.env.PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_STORAGE_URL;

// Determine if Cloudflare R2 Storage is configured
export const isR2StorageConfigured = Boolean(accessKeyId && secretAccessKey && endpoint);

// S3-compatible Client configured for Cloudflare R2
export const r2Client = isR2StorageConfigured
  ? new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
      forcePathStyle: true,
    })
  : null;

/**
 * Upload a photo buffer directly to Cloudflare R2 bucket or local fallback
 * @param buffer File buffer
 * @param filename File name with extension
 * @param mimeType Content MIME type (e.g. image/jpeg, image/png)
 * @returns Public or accessible URL for the uploaded photo
 */
export async function uploadPhotoToBucket(
  buffer: Buffer | Uint8Array,
  filename: string,
  mimeType: string
): Promise<{ url: string; key: string }> {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `uploads/${timestamp}-${sanitized}`;

  if (r2Client) {
    try {
      // Upload directly to Cloudflare R2 Bucket
      await r2Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        })
      );

      // If a public domain is configured (Cloudflare R2 Public .dev or Custom Domain)
      if (publicDomain) {
        const cleanDomain = publicDomain.replace(/\/$/, '');
        return { url: `${cleanDomain}/${key}`, key };
      }

      // Generate a presigned URL or direct path URL
      try {
        const presignedUrl = await getSignedUrl(
          r2Client,
          new GetObjectCommand({ Bucket: bucket, Key: key }),
          { expiresIn: 60 * 60 * 24 * 7 } // 7 days
        );
        return { url: presignedUrl, key };
      } catch {
        const directUrl = `${endpoint?.replace(/\/$/, '')}/${bucket}/${key}`;
        return { url: directUrl, key };
      }
    } catch (error) {
      console.error('Failed to upload to Cloudflare R2 bucket, falling back to local storage:', error);
    }
  }

  // Local filesystem fallback (stored in public/uploads)
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const localFilePath = path.join(uploadsDir, `${timestamp}-${sanitized}`);
  fs.writeFileSync(localFilePath, Buffer.from(buffer));

  const localUrl = `/uploads/${timestamp}-${sanitized}`;
  return { url: localUrl, key };
}
