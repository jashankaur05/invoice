
export interface BaseOptions<R, U = R, C = U> {
    /** resource name used for object keys, usually in camelCase, e.g. 'Customer, Work Load' */
    name: string;
    /** resource path in API, usually in kebab-case, e.g. 'Customer, Work Load' */
    path: string;

    /** labels used for success and error messages if no custom messages are provided */
    labels: {
        none: string;
        singular: string;
        plural: string;
    };

    /** custom messages used for success and error messages */
    messages?: {
        [MessageType.DELETE_SUCCESS]?: (resource: R) => string;
        [MessageType.DELETE_ERROR]?: (resource: R) => string;
        [MessageType.UPDATE_SUCCESS]?: (resource: R) => string;
        [MessageType.UPDATE_ERROR]?: (resource: R) => string;
        [MessageType.CREATE_SUCCESS]?: (resource: R) => string;
        [MessageType.CREATE_ERROR]?: (resource: C) => string;
        [MessageType.DELETE_CONFIRM]?: (resource: R[]) => string;
        [MessageType.UNASSIGN_CONFIRM]?: (resource: R[]) => string;
    };
}

/**
 * available HAL dialog message types
 */
export enum MessageType {
    DELETE_SUCCESS = 'deleteSuccess',
    DELETE_ERROR = 'deleteError',
    UPDATE_SUCCESS = 'updateSuccess',
    UPDATE_ERROR = 'updateError',
    CREATE_SUCCESS = 'createSuccess',
    CREATE_ERROR = 'createError',
    DELETE_CONFIRM = 'deleteConfirm',
    UNASSIGN_CONFIRM = 'unassignConfirm',
}
