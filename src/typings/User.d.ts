export interface User {
    id: number,
    hubSpotPortalId?: number,
    companyInfoId?: number,
    emailAddress: string,
    password: string,
    secret: string,
    roles: string[]
}
