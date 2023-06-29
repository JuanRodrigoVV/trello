import { storage } from "@/appwrite";

const getUrl = async (image: any) => {
  const { bucketId, fileId } = JSON.parse(image);
  const url = await storage.getFilePreview(bucketId, fileId);
  
  console.log('URL:', url);
  
  return url;
};

export default getUrl;