export interface Answer {
    id: string,
    questionId: string,
    description: string,
    isCorrect: boolean,
    isDeleted: boolean,

    question: Question
}

export interface Column {
    id: string,
    name: string,
    description: string,
    decreeId: string,
    isDeleted: boolean,

    decree: Decree,
    statues: Statue[]
}

export interface Decree {
    id: string,
    name: string,
    isDeleted: boolean,

    columns: Column[]
}

export interface Gpssign {
    id: string,
    signId: string,
    latitude: number,
    longtitude: number,
    status: number,
    isDeleted: boolean,

    sign: Sign
}

export interface Keyword {
    id: string,
    name: number,
    paragraphId: number,
    isDeleted: boolean,

    paragraph: Paragraph
}

export interface Paragraph {
    id: string,
    sectionId: string,
    name: number,
    description: string,
    status: number,
    additionalPenalty: string,
    isDeleted: boolean,

    section: Section,
    keywords: Keyword[],
    paragraphModificationRequests: ParagraphModificationRequest[],
    referenceParagraphs: Reference[],
    signParagraphs: SignParagraph[]
}

export interface ParagraphModificationRequest {
    modifiedParagraphId: string,
    modifyingParagraphId: string,
    scribeId: string,
    adminId: string,
    operationType: number,
    status: number,
    isDeleted: boolean,

    admin: User,
    keywords: Keyword[],
    modifiedParagraph: Paragraph,
    modifyingParagraph: Paragraph,
    scribe: User
}

export interface Question {
    id: string,
    testCategoryId: string,
    name: string,
    content: string,
    imageUrl: string,
    status: number,
    isDeleted: boolean,

    testCategory: TestCategory,
    answers: Answer[]
}

export interface QuestionModificationRequest {
    modifiedQuestionId: string,
    modifyingQuestionId: string,
    scribeId: string,
    adminId: string,
    operationType: number,
    status: number,
    isDeleted: boolean,

    admin: User,
    modifiedQuestion: Question,
    modifyingQuestion: Question,
    scribe: User
}

export interface Reference {
    paragraphId: string,
    referenceParagraphId: string,
    isExcluded: boolean,

    paragraph: Paragraph,
    referenceParagraph: Paragraph,
}

export interface Section {
    id: string,
    name: string,
    statueId: string,
    description: string,
    minPenalty: number,
    maxPenalty: number,
    ssDeleted: boolean,

    statue: Statue,
    paragraphs: Paragraph[]
}

export interface Sign {
    id: string,
    signCategoryId: string,
    name: string,
    description: string,
    imageUrl: string,
    status: number,
    isDeleted: boolean,

    signCategory: SignCategory,
    gpssigns: Gpssign[],
    signParagraphs: SignParagraph[]
}

export interface SignCategory {
    id: string,
    name: string,
    isDeleted: boolean,

    signs: Sign[]
}

export interface SignModificationRequest {
    modifiedSignId: string,
    modifyingSignId: string,
    scribeId: string,
    adminId: string,
    operationType: number,
    imageUrl: string,
    status: number,
    isDeleted: boolean,

    admin: User,
    modifiedSign: Sign,
    modifyingSign: Sign,
    scribe: User
}

export interface SignParagraph {
    id: string, 
    signId: string, 
    paragraphId: string,
    isDeleted: boolean,

    paragraph: Paragraph,
    sign: Sign
}

export interface Statue {
    id: string, 
    name: string, 
    vehicleCategoryId: string,
    columnId: string,
    description: string,
    isDeleted: boolean,

    column: Column,
    vehicleCategory: VehicleCategory,
    sections: Section[]
}

export interface TestCategory {
    id: string, 
    name: string, 
    isDeleted: boolean,

    questions: Question[]
}

export interface User {
    id: string, 
    username: string, 
    password: string,
    role: number,
    status: number,
    isDeleted: boolean,

    paragraphModificationRequestAdmins: ParagraphModificationRequest[],
    paragraphModificationRequestScribes: ParagraphModificationRequest[],
    userModificationRequestArbitratingAdmins: UserModificationRequest[],
    userModificationRequestModifiedUsers: UserModificationRequest[],
    userModificationRequestModifyingUsers: UserModificationRequest[],
    userModificationRequestPromotingAdmins: UserModificationRequest[]
}

export enum UserRole {
    ADMIN = 0,
    SCRIBE = 1,
    USER = 2
}

export interface UserModificationRequest {
    modifiedUserId: string,
    modifyingUserId: string,
    promotingAdminId: string,
    arbitratingAdminId: string,
    status: number,
    isDeleted: boolean,

    arbitratingAdmin: User,
    modifiedUser: User,
    modifyingUser: User,
    promotingAdmin: User
}

export interface VehicleCategory {
    id: string, 
    name: string, 
    isDeleted: boolean,

    statues: Statue[]
}