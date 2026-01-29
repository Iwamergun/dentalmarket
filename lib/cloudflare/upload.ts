import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './r2-client'

export async function uploadToR2(
  file: File,
  path: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: path,
    Body: buffer,
    ContentType: file.type,
  })

  await r2Client.send(command)
  
  return `${R2_PUBLIC_URL}/${path}`
}

export async function deleteFromR2(path: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: path,
  })

  await r2Client.send(command)
}

export function getR2Url(path: string): string {
  return `${R2_PUBLIC_URL}/${path}`
}