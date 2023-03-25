import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import deleteFile from './resolvers/delete'
import getAll from './resolvers/get-all'
import uploadFile from './resolvers/upload'
import configureS3 from './utils/configure-s3'
import multerMiddleware from './utils/multer-middleware'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const s3 = configureS3()

app.use(cors({
  origin: '*',
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', getAll(s3))
app.post('/', multerMiddleware.single('file'), uploadFile(s3))
app.delete('/:key', deleteFile(s3))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

export default app