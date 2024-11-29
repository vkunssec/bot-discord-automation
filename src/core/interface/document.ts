import { Document as MongoDocument, ObjectId } from "mongodb";

/**
 * Interface para documentos do MongoDB
 *
 * @interface Document
 * @extends MongoDocument
 */
export declare interface Document extends MongoDocument {
    _id?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}
