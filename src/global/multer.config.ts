import { BadRequestException } from "@nestjs/common";
import * as path from "path";
import { diskStorage } from 'multer';

const imageFileFilter = (req, file, callback) => {
  // Tipos de archivo permitidos
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    // Retornar un error si el tipo MIME no es permitido
    const badRequestError = {
      status: false,
      message: 'Only image files are allowed!',
    };
    return callback(new BadRequestException(badRequestError), false);
  }
  callback(null, true);
};

// Configuración de almacenamiento
const storageConfig = diskStorage({
  destination: (req, file, cb) => {
    const tempPath = path.join(process.cwd(), 'temp');
    cb(null, tempPath); // Define carpeta temporal
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Opciones de configuración de Multer
export const multerOptions = {
  storage: storageConfig, // Configuración de almacenamiento
  fileFilter: imageFileFilter, // Aquí va el filtro
  limits: {
    fileSize: 10 * 1024 * 1024, // Tamaño máximo: 10 MB
  },
};