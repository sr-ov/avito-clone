import { initializeApp } from 'firebase/app'
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
    StorageReference,
} from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyApvaJZjKjR0jqyKrVOjwJu8gdK7fZoGpc',
    authDomain: 'avito-clone-storage.firebaseapp.com',
    projectId: 'avito-clone-storage',
    storageBucket: 'avito-clone-storage.appspot.com',
    messagingSenderId: '636262520512',
    appId: '1:636262520512:web:97da14b482e3283b6b7f25',
}

const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

const getFileRef = (path: string) => ref(storage, path)

type ToSaveData = [string, File]

export class ImageService {
    toRemove: string[] = []
    toSave: ToSaveData[] = []

    pushToRemove = (path: string | string[]) => {
        this.toRemove = this.toRemove.concat(path)
    }

    pushToSave = ([path, file]: [string, File]) => {
        this.toSave.push([path, file])
    }

    removeFromSave = (path: string) => {
        this.toSave = this.toSave.filter((el) => el[0] !== path)
    }

    setToRemove = (path: string) => {
        this.toRemove = [path]
    }

    setToSave = (path: string, file: File) => {
        this.toSave = [[path, file]]
    }

    getImage = async (path: string) => {
        return getDownloadURL(getFileRef(path))
    }

    save = async () => {
        await Promise.all(
            this.toSave.map(([path, file]) =>
                uploadBytes(getFileRef(path), file)
            )
        )
    }

    remove = async () => {
        await Promise.all(
            this.toRemove.map((path) => deleteObject(getFileRef(path)))
        )
    }
}
