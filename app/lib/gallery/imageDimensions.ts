import { open } from 'node:fs/promises';

/**
 * Reads intrinsic image dimensions straight out of the file header.
 *
 * Deliberately dependency-free: the gallery only needs width/height to reserve
 * layout space, which every supported format stores in its first few hundred
 * bytes. Pulling in `sharp` or `image-size` for this would add a dependency
 * (and, in sharp's case, a native binary) for ~20 bytes of data.
 *
 * Returns `null` for formats it can't parse; callers fall back to a default
 * aspect ratio rather than dropping the image.
 */

export interface Dimensions {
  width: number;
  height: number;
}

/** Enough for every format's header, and for most JPEG EXIF blocks. */
const HEADER_BYTES = 64 * 1024;

/** Upper bound when a JPEG hides its SOF marker behind a large thumbnail. */
const MAX_JPEG_SCAN = 1024 * 1024;

export async function readImageDimensions(
  filePath: string
): Promise<Dimensions | null> {
  let handle;

  try {
    handle = await open(filePath, 'r');
  } catch {
    return null;
  }

  try {
    const header = Buffer.alloc(HEADER_BYTES);
    const { bytesRead } = await handle.read(header, 0, HEADER_BYTES, 0);
    const buffer = header.subarray(0, bytesRead);

    const parsed =
      parsePng(buffer) ??
      parseGif(buffer) ??
      parseWebp(buffer) ??
      parseIsoBmff(buffer);

    if (parsed) return parsed;
    if (!isJpeg(buffer)) return null;

    const fromHeader = parseJpeg(buffer);
    if (fromHeader) return fromHeader;

    // Some cameras write a full-size EXIF thumbnail before the SOF marker.
    const { size } = await handle.stat();
    const scanSize = Math.min(size, MAX_JPEG_SCAN);
    if (scanSize <= bytesRead) return null;

    const wide = Buffer.alloc(scanSize);
    const wideRead = await handle.read(wide, 0, scanSize, 0);
    return parseJpeg(wide.subarray(0, wideRead.bytesRead));
  } catch {
    return null;
  } finally {
    await handle.close();
  }
}

function parsePng(buffer: Buffer): Dimensions | null {
  if (buffer.length < 24) return null;
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  if (buffer.toString('ascii', 12, 16) !== 'IHDR') return null;

  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function parseGif(buffer: Buffer): Dimensions | null {
  if (buffer.length < 10) return null;

  const signature = buffer.toString('ascii', 0, 6);
  if (signature !== 'GIF87a' && signature !== 'GIF89a') return null;

  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
}

function parseWebp(buffer: Buffer): Dimensions | null {
  if (buffer.length < 30) return null;
  if (buffer.toString('ascii', 0, 4) !== 'RIFF') return null;
  if (buffer.toString('ascii', 8, 12) !== 'WEBP') return null;

  switch (buffer.toString('ascii', 12, 16)) {
    // Lossy: 3-byte frame tag + 3-byte sync code, then 14-bit dimensions.
    case 'VP8 ':
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };

    // Lossless: 1-byte signature, then two 14-bit fields holding size - 1.
    case 'VP8L': {
      const bits = buffer.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }

    // Extended: 4-byte flags, then two 24-bit canvas fields holding size - 1.
    case 'VP8X':
      return {
        width: buffer.readUIntLE(24, 3) + 1,
        height: buffer.readUIntLE(27, 3) + 1,
      };

    default:
      return null;
  }
}

/** AVIF / HEIC: pull dimensions from the `ispe` (image spatial extents) box. */
function parseIsoBmff(buffer: Buffer): Dimensions | null {
  if (buffer.length < 16) return null;
  if (buffer.toString('ascii', 4, 8) !== 'ftyp') return null;

  const brand = buffer.toString('ascii', 8, 12);
  const known = ['avif', 'avis', 'heic', 'heix', 'hevc', 'mif1', 'msf1'];
  if (!known.includes(brand)) return null;

  const index = buffer.indexOf('ispe', 0, 'ascii');
  if (index < 0 || index + 16 > buffer.length) return null;

  // box: size(4) type(4) version+flags(4) width(4) height(4)
  return {
    width: buffer.readUInt32BE(index + 8),
    height: buffer.readUInt32BE(index + 12),
  };
}

function isJpeg(buffer: Buffer): boolean {
  return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8;
}

function parseJpeg(buffer: Buffer): Dimensions | null {
  let offset = 2;

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];

    // Fill bytes.
    if (marker === 0xff) {
      offset += 1;
      continue;
    }

    // Standalone markers carry no length field.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }

    // Start of scan / end of image: past this point there is no SOF to find.
    if (marker === 0xda || marker === 0xd9) return null;

    // SOF0-SOF15, excluding the Huffman/arithmetic/DNL tables that share the range.
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isStartOfFrame) {
      // segment: FF marker length(2) precision(1) height(2) width(2)
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) return null;
    offset += 2 + length;
  }

  return null;
}
