import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ftp from "basic-ftp"
import { IBadRequestex } from 'src/global/responseInterfaces';

@Injectable()
export class FtpService {

  private client: ftp.Client;
  private FTP_SERVER: string;
  private FTP_USER: string;
  private FTP_PASSWORD; string;

  constructor(private readonly configService: ConfigService){
    this.client = new ftp.Client;
    this.client.ftp.verbose = true; // Muestra los logs de la conexion
    this.FTP_SERVER = this.configService.get<string>('FTP_SERVER'),
    this.FTP_USER = this.configService.get<string>('FTP_USER'),
    this.FTP_PASSWORD = this.configService.get<string>('FTP_PASSWORD')
  }

  async connectToFTPServer() {
    try {
      await this.client.access({
        host: this.FTP_SERVER,
        user: this.FTP_USER,
        password: this.FTP_PASSWORD,
        secure: false
      })
    } catch (error) {
      console.error(error);
      const connectionError: IBadRequestex = {
        status: false,
        message: "Error connecting the FTP server"
      };
      throw new BadRequestException(connectionError);
    }
  }

  async uploadFile(localPath: string, remotePath: string) {
    try {
      const ftpResponse: ftp.FTPResponse = await this.client.uploadFrom(localPath, remotePath);
      return ftpResponse;
    } catch (error) {
      console.error(error);
      const uploadingError: IBadRequestex = {
        status: false,
        message: "Error uploading the files on the FTP server"
      };
      throw new BadRequestException(uploadingError);
    }
  }

  async closeFTPServerConnection() {
    try {
      this.client.close();
    } catch (error) {
      console.error(error);
      const disconnectionError: IBadRequestex = {
        status: false,
        message: "Error in the FTP server disconnection"
      };
      throw new BadRequestException(disconnectionError);
    }
  }
}
