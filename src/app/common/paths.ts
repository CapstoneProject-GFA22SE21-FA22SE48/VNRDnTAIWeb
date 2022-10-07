/* paths.ts was created to provide shrinked links for API calling. */
// Base path
const base = 'https://localhost:5001/api';

//Login
export const Login: string = base + '/Users/Login';

//Admin
export const AdminGetAllMemberData: string = base + '/AdminReports/MemberByYear';
export const AdminGetNewMemberData: string = base + '/AdminReports/NewMember';
export const AdminGetMembers: string = base + '/Users/Members';
export const AdminGetMemberComments: string = base + '/Comments/Members';
export const AdminDeactivateMember: string = base + '/Users/Members/Deactivate';
export const AdminReEnableMember: string = base + '/Users/Members/ReEnable';

export const AdminGetScribes: string = base + '/Users/Scribes'

// Scribe
export const CreateScribe: string = base + '/';
export const UpdateScribe: string = base + '/';

// Request of Modification
export const AcceptRequest: string = base + '/';
export const DenyRequest: string = base + '/';

// Notification
