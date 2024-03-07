export interface User {
    id: number,
    hubSpotPortalId?: number | null,
    companyInfoId?: number,
    emailAddress: string,
    password: string,
    secret: string,
    roles: string[]
}
