// Dependencies
import QRCode from "qrcode";
import { QR_CODE } from "./constants";

// Types
import type { QrDrawing } from "./types";

/**
 * The {@link getQrDrawing} helper
 * @description Draws a QR code for a link as one SVG path of square modules, with a quiet margin, so the page colours it with tokens
 * @param {string} text - The link the code opens
 * @returns {QrDrawing} The path and the size of its square, in modules
 */
export function getQrDrawing(text: string): QrDrawing {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: QR_CODE.CORRECTION });
  const squares: string[] = [];

  // One square per dark module, moved in by the margin
  for (let row = 0; row < modules.size; row += 1) {
    for (let column = 0; column < modules.size; column += 1) {
      if (modules.get(row, column)) {
        squares.push(`M${column + QR_CODE.MARGIN} ${row + QR_CODE.MARGIN}h1v1h-1z`);
      }
    }
  }

  // The path and the square it sits in
  return { size: modules.size + QR_CODE.MARGIN * 2, path: squares.join("") };
}
