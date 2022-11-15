import { SubjectType } from "../common/subjectType"

export interface Answer {
    id: string,
    questionId: string,
    description: string,
    isCorrect: boolean,
    isDeleted: boolean,

    question: Question
}

export interface AssignedColumn {
    columnId: string,
    userId: string,
    isDeleted: boolean
}

export interface AssignedSignCategory {
    signCategoryId: string,
    userId: string,
    isDeleted: boolean
}

export interface AssignedQuestionCategory {
    questionCategoryId: string,
    userId: string,
    isDeleted: boolean
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

export interface Comment {
    id: string,
    userId: string,
    content: string,
    createdDate: Date,
    isDeleted: boolean,

    user: User
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
    longitude: number,
    status: number,
    isDeleted: boolean,

    sign: Sign
}

export interface Keyword {
    id: string,
    name: number,
    isDeleted: boolean,

    paragraph: Paragraph
}

export interface KeywordParagraph {
    keywordId: string,
    paragraphId: string,
    isDeleted: boolean
}

export interface Paragraph {
    id: string,
    sectionId: string,
    name: number,
    description: string,
    status: number,
    additionalPenalty: string,
    isDeleted: boolean,

    referenceParagraphs: Paragraph[],

    section: Section,
    keywords: Keyword[],
    LawModificationRequests: LawModificationRequest[],
    // referenceParagraphs: Reference[],
    signParagraphs: SignParagraph[]
}

export interface LawModificationRequest {
    id: string;
    modifiedStatueId: string,
    modifyingStatueId: string,
    modifiedSectionId: string,
    modifyingSectionId: string,
    modifiedParagraphId: string,
    modifyingParagraphId: string,
    scribeId: string,
    adminId: string,
    operationType: number,
    status: number,
    createdDate: Date,
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
    questionCategoryId: string,
    content: string,
    imageUrl: string,
    status: number,
    isDeleted: boolean,

    testCategory: TestCategory,
    answers: Answer[]
}

export interface QuestionDTO {
    id: string,
    content: string,
    imageUrl: string,

    testCategoryId: string,
    testCategoryName: string,
    questionCategoryId: string,
    questionCategoryName: string
}

export interface QuestionModificationRequest {
    modifiedQuestionId: string,
    modifyingQuestionId: string,
    scribeId: string,
    adminId: string,
    operationType: number,
    status: number,
    createdDate: Date,
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
    vehicleCategoryId: string,
    statueId: string,
    description: string,
    minPenalty: number,
    maxPenalty: number,
    ssDeleted: boolean,

    statue: Statue,
    vehicleCategory: VehicleCategory;
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
    createdDate: Date,
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
    columnId: string,
    description: string,
    isDeleted: boolean,

    column: Column,
    sections: Section[]
}

export interface TestCategory {
    id: string, 
    name: string, 
    isDeleted: boolean,

    questions: Question[]
}

export interface TestResult {
    id: string,
    userId: string,
    testCategoryId: string,
    createdDate: Date,
    isDeleted: boolean,

    testCategory: TestCategory,
    user: User,
    testResultDetails: TestResultDetail[]
}

export interface TestResultDetail {
    id: string,
    testResultId: string,
    questionId: string,
    answerId: string,
    isCorrect: boolean,
    isDeleted: boolean,

    answer: Answer,
    question: Question,
    testResult: TestResult
}

export interface User {
    id: string, 
    username: string, 
    password: string,
    gmail: string,
    role: number,
    status: number,
    createdDate: Date,
    isDeleted: boolean,

    LawModificationRequestAdmins: LawModificationRequest[],
    LawModificationRequestScribes: LawModificationRequest[],
    userModificationRequestArbitratingAdmins: UserModificationRequest[],
    userModificationRequestModifiedUsers: UserModificationRequest[],
    userModificationRequestModifyingUsers: UserModificationRequest[],
    userModificationRequestPromotingAdmins: UserModificationRequest[]
}

export interface UserModificationRequest {
    modifiedUserId: string,
    modifyingUserId: string,
    promotingAdminId: string,
    arbitratingAdminId: string,
    status: number,
    createdDate: Date,
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

export interface ReferenceDTO {
    referenceParagraphId: string,
    referenceParagraphName: string,
    referenceParagraphDesc: string,
    referenceParagraphSectionId: string,
    referenceParagraphSectionName: string,
    referenceParagraphSectionStatueId: string,
    referenceParagraphSectionStatueName: string,
    referenceParagraphIsExcluded: boolean,
}
 
export interface NewParagraphDTO {
    sectionId: string,
    name: string,
    description: string, 
    additionalPenalty: string,
    keywordId: string,
    referenceParagraphs: ReferenceDTO[]
}

export interface NewSectionDTO {
    statueId: string,
    name: string,
    description: string,
    vehicleCategoryId: string,
    minPenalty: number,
    maxPenalty: number,
    isSectionWithNoParagraph: boolean,
    
    paragraphs?: NewParagraphDTO[] //when not a section with no paragraph
    referenceParagraphs?: ReferenceDTO[] //when a section with no paragraph and has references
}

export interface AdminDTO {
    id: string,
    name: string,
    pendingRequests: string
}

//Enumeration
export enum UserRole {
    ADMIN = 0,
    SCRIBE = 1,
    USER = 2
}

//AdminUserReportDTO
export interface AdminUserByYearDTO {
    userByYear: number[],
}

//Used for notification
export interface Notification {
    key?: string
    subjectId: string,
    subjectType: string,
    senderId: string,
    senderUsername: string,
    receiverId: string,
    receiverUsername: string,
    action: string,
    relatedDescription: string,
    createdDate: string,
    isRead: boolean,

}

//Used for sign image labelling
export interface Shape {
    x: number,
    y: number,
    w: number,
    h: number,
}