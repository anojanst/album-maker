import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3'
import 'dotenv/config'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

await r2.send(
  new PutBucketCorsCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: ['https://www.kisku.online', 'http://localhost:3000'],
          AllowedMethods: ['PUT', 'GET', 'HEAD'],
          AllowedHeaders: ['Content-Type', 'Content-Length'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  })
)

console.log('CORS configured on bucket:', process.env.R2_BUCKET_NAME)
