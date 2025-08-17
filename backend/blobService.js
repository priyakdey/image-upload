import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential
} from "@azure/storage-blob";
import dotenv from "dotenv";
import { v7 as uuidv7 } from "uuid";

dotenv.config();

const AZURE_ACCOUNT_NAME = process.env.AZURE_ACCOUNT_NAME;
const AZURE_ACCOUNT_KEY = process.env.AZURE_ACCOUNT_KEY;
const AZURE_ACCOUNT_CONTAINER = process.env.AZURE_ACCOUNT_CONTAINER;

const CONNECTION_STRING = `DefaultEndpointsProtocol=http;AccountName=${AZURE_ACCOUNT_NAME};AccountKey=${AZURE_ACCOUNT_KEY};BlobEndpoint=http://127.0.0.1:10000/${AZURE_ACCOUNT_NAME};`;

const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
const containerServiceClient = blobServiceClient.getContainerClient(AZURE_ACCOUNT_CONTAINER);

export async function uploadBlob(file) {
  const { size, buffer, originalname, mimetype } = file;

  const id = uuidv7();
  const metadata = {
    "filename": originalname,
    "mimetype": mimetype,
    "size": size.toString()
  };

  const {
    blockBlobClient,
    response
  } = await containerServiceClient.uploadBlockBlob(id, buffer, size, { metadata: metadata });

  if (response.errorCode) {
    console.error(`Faced issue when uploading the image: ${response.errorCode}`);
    throw new Error(response.errorCode);
  }

  const url = `${blockBlobClient.url}?${generateSASReadString(originalname. mimetype)}`;
  return Promise.resolve({ "id": id, "url": url });
}

export async function downloadBlob(blobName) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
  const containerServiceClient = blobServiceClient.getContainerClient(AZURE_ACCOUNT_CONTAINER);

  const blobClient = containerServiceClient.getBlobClient(blobName);

  if (!(await blobClient.exists())) {
    throw new Error("File not found");
  }

  const metadata = await blobClient.getProperties();
  const buffer = await blobClient.downloadToBuffer();

  return Promise.resolve({ "metadata": metadata, "buffer": buffer });
}

function generateSASReadString(filename, mimetype) {
  const permissions = new BlobSASPermissions();
  permissions.read = true;

  const iat = new Date();
  const eat = new Date(iat);
  eat.setDate(eat.getDate() + 30);

  const blobSasModel = {
    containerName: AZURE_ACCOUNT_CONTAINER,
    blobName: filename,
    permissions: permissions,
    startsOn: iat,
    expiresOn: eat,
    protocol: SASProtocol.HttpsAndHttp,
    contentType: mimetype,
    contentDisposition: `attachment; filename=${filename}`,
    cacheControl: "public; max-age=2592000"
  };

  const credentials = new StorageSharedKeyCredential(AZURE_ACCOUNT_NAME, AZURE_ACCOUNT_KEY);
  return generateBlobSASQueryParameters(blobSasModel, credentials);
}
