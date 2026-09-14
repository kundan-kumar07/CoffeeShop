import imagekit from "../config/imagekit.js";

const uploadToImageKit = async (fileBuffer, fileName) => {
    const response = await imagekit.files.upload({
        file: fileBuffer.toString("base64"),
        fileName,
        folder: "/coffee-shop/products",
    });

    return response;
};

export default uploadToImageKit;