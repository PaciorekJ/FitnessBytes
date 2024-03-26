import imageCompression from "browser-image-compression";

function arrayBufferToBase64(buffer: ArrayBuffer) {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
	const binaryString = window.atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
}

async function compressImage(file: File) {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 320,
        useWebWorker: true,
        alwaysKeepResolution: true,
    };

    const compressedFile = await imageCompression(file, options);
    return compressedFile;
}

async function encodeImage(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const base64Array = arrayBufferToBase64(arrayBuffer);
    return base64Array;
}

function decodeImage(encodedFile: string, mimeType: string) {
    const newBuffer = base64ToArrayBuffer(encodedFile);
    const imageBlob = new Blob([newBuffer], { type: mimeType });
    return imageBlob;
}

export { compressImage, decodeImage, encodeImage };

