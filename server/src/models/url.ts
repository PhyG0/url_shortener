import { Schema, Document, model } from "mongoose";


export interface IURL extends Document {
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
    owner: Schema.Types.ObjectId;
}

const UrlSchema = new Schema<IURL>({
    originalUrl: {
        type: String, 
        required: true
    },
    shortUrl: {
        type: String, 
        required: true
    }, 
    clicks: {
        type: Number, 
        default: 0
    }, 
    createdAt: {
        type: Date,
        default: Date.now()
    }, 

    owner: {
        type: Schema.Types.ObjectId,
        required: true
    }

});


const URL = model<IURL>("URL", UrlSchema);

export default URL;