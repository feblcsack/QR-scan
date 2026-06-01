import QRCode from 'qrcode';

export async function generateQRCode(itemId: string): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const scanUrl = `${appUrl}/scan/${itemId}`;

  const dataUrl = await QRCode.toDataURL(scanUrl, {
    width: 400,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
  });

  return dataUrl;
}

export function getScanUrl(itemId: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${appUrl}/scan/${itemId}`;
}
