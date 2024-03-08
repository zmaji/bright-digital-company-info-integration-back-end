export interface PropertyField {
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
