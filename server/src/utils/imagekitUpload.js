import fs from "fs/promises";
import imagekit from "../config/imagekit.js";

const uploadToImageKit = async (filePath, fileName) => {
    const fileBuffer = await fs.readFile(filePath);

    const response = await imagekit.files.upload({
        file: fileBuffer.toString("base64"),
        fileName,
        folder: "/coffee-shop/products",
    });

    return response;
};

export default uploadToImageKit;