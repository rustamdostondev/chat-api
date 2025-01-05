import ObjectID from 'bson-objectid';

export const objectId = () => new ObjectID().toString();
