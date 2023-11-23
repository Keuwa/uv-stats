import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  WhereFilterOp,
} from 'firebase/firestore'
import { firestore } from './client'

export interface IFirestoreQuery {
  field: string
  operator: WhereFilterOp
  value: string | boolean
}

export default class FirebaseCrud {
  async createDocument(
    data: { [key: string]: any },
    collectionName: string
  ): Promise<void> {
    const collectionRef = collection(firestore, collectionName)
    await addDoc(collectionRef, data)
  }

  async readDocument(collectionName: string, documentId: string): Promise<any> {
    const docRef = doc(firestore, collectionName, documentId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log('No such document!')
      return null
    }
  }

  async updateDocument(
    collectionName: string,
    documentId: string,
    data: { [key: string]: any }
  ): Promise<void> {
    const docRef = doc(firestore, collectionName, documentId)
    await updateDoc(docRef, data)
  }

  async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<void> {
    const docRef = doc(firestore, collectionName, documentId)
    await deleteDoc(docRef)
  }

  listenForChanges(
    collectionName: string,
    callback: (data: { [key: string]: any }[]) => void,
    queryParam?: IFirestoreQuery
  ): () => void {
    let collectionRef = query(collection(firestore, collectionName))

    if (queryParam !== undefined) {
      collectionRef = query(
        collectionRef,
        where(queryParam.field, queryParam.operator, queryParam.value)
      )
    }
    const unsubscribe = onSnapshot(collectionRef, (snapshot: any) => {
      const data: { [key: string]: any }[] = []
      snapshot.forEach((doc: any) => {
        data.push({ id: doc.id, ...doc.data() })
      })
      callback(data)
    })

    // Return the unsubscribe function to stop listening for changes
    return unsubscribe
  }
}
