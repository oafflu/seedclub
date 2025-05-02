declare module 'pdfmake/build/pdfmake' {
  interface TDocumentDefinitions {
    content: any[];
    styles?: {
      [key: string]: {
        fontSize?: number;
        bold?: boolean;
        margin?: number[];
      };
    };
  }

  interface TFontFamily {
    normal?: string;
    bold?: string;
    italics?: string;
    bolditalics?: string;
  }

  interface TCreatedPdf {
    download(defaultFileName?: string): void;
    getBlob(cb: (blob: Blob) => void): void;
    getBase64(cb: (base64: string) => void): void;
    getBuffer(cb: (buffer: Buffer) => void): void;
  }

  interface PDFMake {
    vfs: { [file: string]: string };
    createPdf(documentDefinition: TDocumentDefinitions): TCreatedPdf;
  }

  const pdfMake: PDFMake;
  export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  const vfs: {
    pdfMake: {
      vfs: { [file: string]: string };
    };
  };
  export default vfs;
} 