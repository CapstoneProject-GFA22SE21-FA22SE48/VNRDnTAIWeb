/* paths.ts was created to provide shrinked links for API calling. */
// Base path
const base = 'https://localhost:5001/api';

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

export const AdminGetScribes: string = base + '/Users/Scribes'

// Scribe
export const ScribeGetQuestions: string = base + '/Questions';
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

export const ScribeCreateStatueForROM: string = base + '/Statues';
export const ScribeCreateSectionForROM: string = base + '/Sections';
export const ScribeCreateLawModificationRequest: string = base + '/LawModificationRequests'; //used for statue, section, paragraph