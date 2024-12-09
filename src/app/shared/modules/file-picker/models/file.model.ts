import { Observable } from 'rxjs';
import { BaseResource } from 'src/app/core/base/models/base-resource';

/** File details */
export interface FileDetails extends BaseResource {
    filename: string;
    extension: string;
    description: string;
}

/** Update File details */
export interface FileUpdate {
    id?: string;
    filename: string;
    description: string;
    //TODO:access?;
}

/** File Upload Response */
export interface File extends BaseResource {
    id: number;
    filename: string;
    extension: string;
    created: string;
    lastModified: string;
    description: string;
    size: number;
    content?: Observable<string | ArrayBuffer>; // for file content
    status: string;
    amount: number;
    date: string;
}

/**
 * Special File for an Image
 */
export interface ImageFile extends File {
    sizes?: string[];
}

export class UploadFile implements File {
    id: number; // after file is uploaded we get id
    created: string = '';
    lastModified: string = '';
    content?: Observable<string | ArrayBuffer> | undefined;
    inherited?: boolean | undefined;
    name: string | undefined;
    readOnly?: boolean | undefined;
    extension = '';
    progress = 0;
    inProgress = false;
    isUploadComplete = false;
    size = 0;
    description: string = '';
    status: string;
    amount: number;
    date: string;

    private _filename: string = '';
    get filename(): string {
        return this._filename;
    }
    set filename(name: string) {
        this._filename = name;
        this.extension = name.split('.').pop() ?? '';
    }
}

/**
 * interface for file upload config
 */
export interface FileUploadConfig {
    // enableBrowse : (default true) ⟶ if false the "browse" tab is not visible and global files can not be selected
    enableBrowse?: boolean;

    // multiple: (default false) ⟶ indicates that multiple files can be uploaded
    multiple?: boolean;

    // extensionsLimit: (default none) ⟶ indicates which file extensions are allowed. If none, all extensions are allowed.
    allowedExtensions?: string[];

    // sizeLimit (in MB, default 10) --> indicates the maximum size per file
    fileSizeLimit?: number;

    // fileLimit: indicates how many files are allowed (always 1 if multiple is false, otherwise >1)
    fileLimit?: number;
}

export const FILE_UPLOAD_CONFIG_DEFAULT: FileUploadConfig = {
    enableBrowse: true,
    multiple: false,
    allowedExtensions: [],
    fileSizeLimit: 20971520, // 20MB === 20971520 bytes
};
