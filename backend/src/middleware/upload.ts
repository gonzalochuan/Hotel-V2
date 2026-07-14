import multer from 'multer'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('Only image uploads are allowed'))
      return
    }
    callback(null, true)
  },
})
