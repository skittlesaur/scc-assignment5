import { Request, Response } from 'express'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import cuid from 'cuid'

const uploadFile = (s3: S3Client) => {
  return async (req: Request, res: Response) => {
    try {
      const { file } = req

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      const fileExtension = file.originalname.split('.').pop()
      const fileName = file.originalname.split('.').slice(0, -1).join('.')
      const key = `${fileName}_${cuid()}.${fileExtension}`

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `files/${key}`,
        Body: file.buffer,
      }

      const command = new PutObjectCommand(params)

      const result = await s3.send(command)

      return res.json({
        success: true,
        message: 'File uploaded successfully',
        key,
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        message: 'Error uploading file',
      })
    }
  }
}

export default uploadFile