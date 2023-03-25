import multer from 'multer'

const multerMiddleware = multer({
  storage: multer.memoryStorage(),
})

export default multerMiddleware