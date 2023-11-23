export default interface FirebaseEntity {
    id: string 
}

export function isFirebaseEntity(object: any): object is FirebaseEntity {
    return 'id' in object
}