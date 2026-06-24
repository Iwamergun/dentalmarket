import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { S3Client } from '@aws-sdk/client-s3'
import { getAuthMetadata } from '@/lib/auth/access'
import { canUploadMedia } from '@/lib/auth/upload-access'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function slugifyFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-|-$/g, '')
}

function getR2Client() {
  const endpoint = process.env.R2_ENDPOINT
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 environment variables are not configured: ' +
      (!endpoint ? 'R2_ENDPOINT ' : '') +
      (!accessKeyId ? 'R2_ACCESS_KEY_ID ' : '') +
      (!secretAccessKey ? 'R2_SECRET_ACCESS_KEY' : '')
    )
  }

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !canUploadMedia(profile.role, getAuthMetadata(user))) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Sadece JPEG, PNG ve WebP formatları desteklenir' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Dosya boyutu 10MB\'dan büyük olamaz' },
        { status: 400 }
      )
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const baseName = file.name.replace(/\.[^.]+$/, '')
    const slugified = slugifyFilename(baseName)
    const timestamp = Date.now()
    const objectPath = `products/${timestamp}-${slugified}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const bucketName = process.env.R2_BUCKET_NAME || 'dentalmarket'
    const r2 = getR2Client()

    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectPath,
        Body: buffer,
        ContentType: file.type,
      })
    )

    const publicUrl = `${(process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '')}/${objectPath}`

    // Non-blocking: log to media_assets but don't fail the upload if this errors
    supabase.from('media_assets').insert({
      owner_profile_id: user.id,
      storage_provider: 'r2',
      bucket: bucketName,
      object_path: objectPath,
      public_url: publicUrl,
      mime_type: file.type,
      bytes: file.size,
    }).then(({ error }) => {
      if (error) {
        console.warn('media_assets insert warning (non-fatal):', error.message)
      }
    })

    return NextResponse.json({ path: objectPath, publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : 'Dosya yüklenirken bir hata oluştu'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
