export interface User {
    id?: number,
    hubSpotPortalId?: number | null,
    companyInfoId?: number,
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string,
    secret: string,
    roles: string[],
    activationToken: string,
    isActive: boolean
}
