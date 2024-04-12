export interface PropertyField {
    updatedAt?: Date,
    createdAt?: Date,
    description?: string,
    calculated?: boolean,
    externalOptions?: boolean,
    hidden?: boolean,
    hubspotDefined?: boolean,
    modificationMetadata?: object,
    formField?: boolean,
    label: string;
    name: string;
    type: string;
    fieldType: string;
    groupName: string;
    hidden: boolean;
    displayOrder: number;
    hasUniqueValue: boolean;
    formField: boolean;
    options?: PropertyOption[];
}
