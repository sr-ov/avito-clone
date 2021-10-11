import { Injectable } from '@nestjs/common'
import { v4 as genFileName } from 'uuid'
import * as path from 'path'
import * as fse from 'fs-extra'

@Injectable()
export class FileService {
    private readonly pathStatic: string

    constructor() {
        this.pathStatic = path.join(__dirname, '..', 'static')
    }

    generateFilePath(
        file: Express.Multer.File,
        userId: string,
        type: string,
    ): string {
        const fileExt = file.originalname.split('.').pop().toLowerCase()
        const fileName = `${genFileName()}.${fileExt}`

        return `${userId}/${type}/${fileName}`
    }

    async createFile(
        files: Express.Multer.File[],
        userId: string,
        type: string,
    ): Promise<string[]> {
        try {
            const paths = []

            for (const file of files) {
                const filePath = this.generateFilePath(file, userId, type)
                const absolutefilePath = path.join(this.pathStatic, filePath)

                await fse.outputFile(absolutefilePath, file.buffer)

                paths.push(filePath)
            }

            return paths
        } catch (err) {
            console.error(err)
        }
    }

    async removeFile(rmFilePaths: string[]): Promise<void> {
        try {
            for (const filePath of rmFilePaths) {
                const p = path.join(this.pathStatic, filePath)
                if (p.startsWith(this.pathStatic)) {
                    await fse.remove(p)
                }
            }
        } catch (err) {
            console.error(err)
        }
    }
}
