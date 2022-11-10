/* paths.ts was created to provide shrinked links for API calling. */
// Base path
// const base = 'https://localhost:5001/api';
 const base = 'https://vnrdntaiapi.azurewebsites.net/api';

//Login
export const Login: string = base + '/Users/Login';
export const GetScribeAssignColumns: string = base + '/AssignedColumns/Scribes';

//Common 
export const GetAccountInformation: string = base + '/Users';

//Admin
export const AdminGetAllMemberDataReport: string = base + '/AdminReports/MemberByYear';
export const AdminGetNewMemberDataReport: string = base + '/AdminReports/NewMember';
export const AdminGetRomReport: string = base + '/AdminReports/ROMReport';
export const AdminGetScribeReport: string = base + '/AdminReports/ScribeReport';

export const AdminGetMembers: string = base + '/Users/Members';
export const AdminGetMemberComments: string = base + '/Comments/Members';
export const AdminDeactivateMember: string = base + '/Users/Members/Deactivate';
export const AdminReEnableMember: string = base + '/Users/Members/ReEnable';

export const AdminGetScribes: string = base + '/Users/Scribes';
export const AdminGetScribeDetail: string = base + '/Users/Scribes/Detail';

export const AdminGetRomList: string = base + '/LawModificationRequests/AdminROMList';
export const AdminDeactivateScribe: string = base + '/Users/Scribes/Deactivate';
export const AdminReEnableScribe: string = base + '/Users/Scribes/ReEnable';

export const AdminPromoteScribe: string = base + '/Users/Scribes/Promote';
export const AdminCreateNewScribe: string = base + '/Users';

export const AdminGetTasks: string = base + "/AssignedColumns/Tasks";
export const AdminUpdateAssignedTasks: string = base + "/AssignedColumns/TasksUpdate";

export const AdminGetLawRomDetail: string = base + '/LawModificationRequests/ROMDetail';
export const AdminGetParagraphRomDetailReference: string = base + '/LawModificationRequests/ParagraphROMDetail/References';
export const AdminGetSignRomDetail: string = base + '/SignModificationRequests/SignROMDetail';
export const AdminGetQuestionRomDetail: string = base + '/QuestionModificationRequests/QuestionROMDetail';
export const AdminGetUserRomDetail: string = base + '/UserModificationRequests/UserROMDetail';

export const AdminApproveQuestionRom: string = base + '/QuestionModificationRequests/Approve';
export const AdminDenyQuestionRom: string = base + '/QuestionModificationRequests/Deny';
export const AdminApproveSignRom: string = base + '/SignModificationRequests/Approve';
export const AdminDenySignRom: string = base + '/SignModificationRequests/Deny';
export const AdminApproveStatueRom: string = base + '/LawModificationRequests/Statue/Approve';
export const AdminDenyStatueRom: string = base + '/LawModificationRequests/Statue/Deny';
export const AdminApproveSectionRom: string = base + '/LawModificationRequests/Section/Approve';
export const AdminDenySectionRom: string = base + '/LawModificationRequests/Section/Deny';
export const AdminApproveParagraphRom: string = base + '/LawModificationRequests/Paragraph/Approve';
export const AdminDenyParagraphRom: string = base + '/LawModificationRequests/Paragraph/Deny';
export const AdminApproveUserRom: string = base + '/UserModificationRequests/Approve';
export const AdminDenyUserRom: string = base + '/UserModificationRequests/Deny';
export const AdminApproveGpssignRom: string = base + '/SignModificationRequests/GPS/Approve';
export const AdminDenyGpssignRom: string = base + '/SignModificationRequests/GPS/Deny';
// Scribe
export const ScribeGetAllStatueForAddingReferences: string = base + '/Statues';

export const ScribeGetAssignedQuestions: string = base + '/Questions/AssignedQuestions/Scribes';
export const ScribeGetTestCategories: string = base + '/TestCategories';
export const ScribeGetAnswersByQuestionId: string = base + '/Answers/Question';
export const ScribeGetAdmins: string = base + '/Users/Admins';
export const ScribeCreateQuestionForROM: string = base + '/Questions';
export const ScribeCreateQuestionModificationRequest: string = base + '/QuestionModificationRequests';

export const ScribeGetPersonalInfo: string = base + '/Users';
export const ScribeGetDecrees: string = base + '/Decrees';
export const ScribeGetVehicleCats: string = base + '/VehicleCategories';
export const ScribeGetAssignedColumnData: string = base + '/Columns/AssignedColumn';
export const ScribeGetSectionsByStatueId: string = base + '/Sections/ByStatue';
export const ScribeGetParagraphsBySectionId: string = base + '/Paragraphs/BySection';
export const ScribeGetKeywords: string = base + '/Keywords';

export const ScribeCreateStatueForROM: string = base + '/Statues';
export const ScribeCreateSectionForROM: string = base + '/Sections';
export const ScribeCreateParagraphForROM: string = base + '/Paragraphs';
export const ScribeCreateLawModificationRequest: string = base + '/LawModificationRequests'; //used for statue, section, paragraph

export const ScribeCreateNewSection: string = base + '/Sections/NewSection';    

export const ScribeGetAssignedSignCategories: string = base + '/SignCategories/AssignedSignCategories/Scribes';    
export const ScribeGetAssignedSigns: string = base + '/Signs/AssignedSigns/Scribes';    

export const ScribeCreateSignForROM: string = base + '/Signs';
export const ScribeCreateSignModificationRequest: string = base + '/SignModificationRequests';

export const ScribeGetRomList: string = base + '/LawModificationRequests/ScribeROMList';
export const ScribeGetGpssignRomList: string = base + '/SignModificationRequests/GpssignROMs';

export const ScribeGetLawRomDetail: string = base + '/LawModificationRequests/ROMDetail';
export const ScribeGetParagraphRomDetailReference: string = base + '/LawModificationRequests/ParagraphROMDetail/References';
export const ScribeGetSignRomDetail: string = base + '/SignModificationRequests/SignROMDetail';
export const ScribeGetQuestionRomDetail: string = base + '/QuestionModificationRequests/QuestionROMDetail';

export const ScribeCancelLawRom: string = base + '/LawModificationRequests/Cancel';
export const ScribeCancelSignRom: string = base + '/SignModificationRequests/Cancel';
export const ScribeCancelQuestionRom: string = base + '/QuestionModificationRequests/Cancel';

export const ScribeDeleteLawRom: string = base + '/LawModificationRequests';
export const ScribeDeleteSignRom: string = base + '/SignModificationRequests';
export const ScribeDeleteQuestionRom: string = base + '/QuestionModificationRequests';

export const ScribeClaimGpssignRom: string = base + '/SignModificationRequests/GPSSign/Claim';
