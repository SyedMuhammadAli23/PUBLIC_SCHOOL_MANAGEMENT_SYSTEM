const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Create S3 client using ECS Task Role credentials automatically
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

/**
 * Upload base64 image to S3
 */
async function uploadUserAvatar(base64Str, userId) {

    const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

    if (!matches) {
        throw new Error('Invalid base64 image');
    }

    const mimeType = matches[1];
    const extension = mimeType.split('/')[1] || 'png';

    const buffer = Buffer.from(matches[2], 'base64');

    const filename = `user_${userId}_${Date.now()}.${extension}`;
    const key = `avatars/${filename}`;

    // Upload to S3 if bucket is configured
    if (BUCKET_NAME) {
        try {

            console.log(`Uploading ${filename} to bucket ${BUCKET_NAME}`);

            await s3Client.send(
                new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: mimeType
                })
            );

            const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

            console.log("Upload successful:", imageUrl);

            return imageUrl;

        } catch (err) {

            console.error("S3 Upload Failed:", err);

            throw err;
        }
    }

    // Local fallback
    console.log("AWS_S3_BUCKET not configured. Saving locally.");

    const uploadDir = path.join(__dirname, "../../uploads");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    return `/uploads/${filename}`;
}

module.exports = {
    uploadUserAvatar
};