/* paths.ts was created to provide shrinked links for API calling. */
// Base path
// const base = 'https://localhost:5001/api';
const base = 'https://vnrdntaiapi.azurewebsites.net/api';

//Login
export const Login: string = base + '/Users/Login';
export const GetScribeAssignColumns: string = base + '/AssignedColumns/Scribes'

//Admin
export const AdminGetAllMemberData: string = base + '/AdminReports/MemberByYear';
export const AdminGetNewMemberData: string = base + '/AdminReports/NewMember';
export const AdminGetMembers: string = base + '/Users/Members';
export const AdminGetMemberComments: string = base + '/Comments/Members';
export const AdminDeactivateMember: string = base + '/Users/Members/Deactivate';
export const AdminReEnableMember: string = base + '/Users/Members/ReEnable';

export const AdminGetScribes: string = base + '/Users/Scribes';

export const AdminGetRomList: string = base + '/LawModificationRequests/AdminROMList';
export const AdminDeactivateScribe: string = base + '/Users/Scribes/Deactivate';
export const AdminReEnableScribe: string = base + '/Users/Scribes/ReEnable';

export const AdminGetColumns: string = base + '/Columns'
export const AdminGetAssignedColumns: string = base + '/AssignedColumns';

export const AdminGetTasks: string = base + "/AssignedColumns/Tasks";

export const AdminGetLawRomDetail: string = base + '/LawModificationRequests/ROMDetail';
export const AdminGetParagraphRomDetailReference: string = base + '/LawModificationRequests/ParagraphROMDetail/References';
export const AdminGetSignRomDetail: string = base + '/SignModificationRequests/SignROMDetail';
export const AdminGetQuestionRomDetail: string = base + '/QuestionModificationRequests/QuestionROMDetail';

// Scribe
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
export const ScribeGetReferenceParagraphsByParagraphId: string = base + '/Paragraphs/BySection';
export const ScribeGetKeywords: string = base + '/Keywords';

export const ScribeCreateStatueForROM: string = base + '/Statues';
export const ScribeCreateSectionForROM: string = base + '/Sections';
export const ScribeCreateParagraphForROM: string = base + '/Paragraphs';
export const ScribeCreateLawModificationRequest: string = base + '/LawModificationRequests'; //used for statue, section, paragraph

export const ScribeCreateNewSection: string = base + '/Sections/NewSection';    

export const ScribeGetAssignedSignCategories: string = base + '/SignCategories/AssigedSignCategories/Scribes';    
export const ScribeGetAssignedSigns: string = base + '/Signs/AssignedSigns/Scribes';    

export const ScribeCreateSignForROM: string = base + '/Signs';
export const ScribeCreateSignModificationRequest: string = base + '/SignModificationRequests';
