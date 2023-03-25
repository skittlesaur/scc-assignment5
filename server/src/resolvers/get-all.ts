import { Request, Response } from 'express'
import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3'

const getAll = (s3: S3Client) => {
  return async (req: Request, res: Response) => {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Prefix: 'files/',
      }

      const command = new ListObjectsCommand(params)

      const result = await s3.send(command)

      const files = result.Contents
        ?.filter((file: any) => file.Size > 0)
        .map((file) => ({
          updatedAt: file.LastModified,
          key: file.Key?.replace('files/', ''),
          size: file.Size,
        }))

      return res.json({
        success: true,
        message: 'Files retrieved successfully',
        files,
      })

    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        message: 'Error getting files',
      })
    }
  }
}

export default getAll