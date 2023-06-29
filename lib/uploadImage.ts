import {ID, storage} from '@/appwrite'

const uploadImage = async (file: File) => {
    if (!file) return;

    const fileUploaded = await storage.createFile (
        "64999ec329be9d971c49",
        ID.unique(),
        file
    );

    return fileUploaded;
}

export default uploadImage;