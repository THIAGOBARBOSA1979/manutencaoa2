
import { google } from 'googleapis';

export class GoogleDriveService {
  private static drive: any;
  private static initialized: boolean = false;

  static async initialize() {
    if (this.initialized) return;

    const auth = new google.auth.OAuth2(
      process.env.VITE_GOOGLE_CLIENT_ID,
      process.env.VITE_GOOGLE_CLIENT_SECRET,
      process.env.VITE_GOOGLE_REDIRECT_URI
    );

    this.drive = google.drive({ version: 'v3', auth });
    this.initialized = true;
  }

  static async uploadFile(file: File, clientId: string, type: 'warranty' | 'document' | 'inspection') {
    try {
      await this.initialize();
      
      const fileName = this.generateFileName(file.name, clientId, type);
      const folderPath = await this.ensureClientFolder(clientId, type);

      const fileMetadata = {
        name: fileName,
        parents: [folderPath],
      };

      const arrayBuffer = await file.arrayBuffer();
      const media = {
        mimeType: file.type,
        body: Buffer.from(arrayBuffer),
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
      });

      return {
        fileId: response.data.id,
        viewLink: response.data.webViewLink,
      };
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      throw new Error('Falha ao fazer upload do arquivo');
    }
  }

  private static generateFileName(originalName: string, clientId: string, type: string): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `${clientId}_${type}_${date}_${originalName}`;
  }

  private static async ensureClientFolder(clientId: string, type: string): Promise<string> {
    try {
      // Check if folder exists
      const folderName = `${clientId}_${type}`;
      const response = await this.drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id)',
      });

      if (response.data.files.length > 0) {
        return response.data.files[0].id;
      }

      // Create new folder
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id',
      });

      return folder.data.id;
    } catch (error) {
      console.error('Error ensuring client folder:', error);
      throw new Error('Falha ao criar/verificar pasta no Google Drive');
    }
  }
}
