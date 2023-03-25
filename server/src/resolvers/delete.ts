import { Request, Response } from 'express'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

const deleteFile = (s3: S3Client) => {
  return async (req: Request, res: Response) => {
    try {
      const { key } = req.params

      if (!key) {
        return res.status(400).json({ message: 'No key provided' })
      }

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `files/${key}`,
      }

      const command = new DeleteObjectCommand(params)

      const result = await s3.send(command)

      return res.json({
        success: true,
        message: 'File deleted successfully',
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        message: 'Error deleting file',
      })
    }
  }
}

export default deleteFile