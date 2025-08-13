import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters, SASProtocol,
  StorageSharedKeyCredential
} from "@azure/storage-blob";
import dotenv from "dotenv";
import { v7 as uuidv7 } from "uuid";

dotenv.config();

const AZURE_ACCOUNT_NAME = process.env.AZURE_ACCOUNT_NAME;
const AZURE_ACCOUNT_KEY = process.env.AZURE_ACCOUNT_KEY;
const AZURE_ACCOUNT_CONTAINER = process.env.AZURE_ACCOUNT_CONTAINER;

const CONNECTION_STRING = `DefaultEndpointsProtocol=http;AccountName=${AZURE_ACCOUNT_NAME};AccountKey=${AZURE_ACCOUNT_KEY};BlobEndpoint=http://127.0.0.1:10000/${AZURE_ACCOUNT_NAME};`;

export async function uploadBlob(buffer, size, mimetype) {

  const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);

  const containerServiceClient = blobServiceClient.getContainerClient(AZURE_ACCOUNT_CONTAINER);

  const blobName = uuidv7();
  const {
    blockBlobClient,
    response
  } = await containerServiceClient.uploadBlockBlob(blobName, buffer, size);


  if (response.errorCode) {
    console.error(`Faced issue when uploading the image: ${response.errorCode}`);
    throw new Error(response.errorCode);
  }

  const url = blockBlobClient.url;

  return Promise.resolve(url + "?" + generateSASReadString(blobName, mimetype));
}

function generateSASReadString(blobName, mimetype) {
  const permissions = new BlobSASPermissions();
  permissions.read = true;

  const iat = new Date();
  const eat = new Date(iat);
  eat.setDate(eat.getDate() + 30);

  const blobSasModel = {
    containerName: AZURE_ACCOUNT_CONTAINER,
    blobName: blobName,
    permissions: permissions,
    startsOn: iat,
    expiresOn: eat,
    protocol: SASProtocol.HttpsAndHttp,
    contentType: mimetype
  };

  const credentials = new StorageSharedKeyCredential(AZURE_ACCOUNT_NAME, AZURE_ACCOUNT_KEY);
  return generateBlobSASQueryParameters(blobSasModel, credentials);
}