/* paths.ts was created to provide shrinked links for API calling. */
// Base path
const base = 'https://localhost:5001/api';

//Login
export const Login: string = base + "/Users/Login";

//Admin
export const AdminUserByYear: string = base + "/AdminReports/UserByYear";
export const AdminGetMembers: string = base + "/Users/Members";
export const AdminGetMemberComments: string = base + '/Comments/Member'

// Scribe
export const CreateScribe: string = base + '/';
export const UpdateScribe: string = base + '/';

// Request of Modification
export const AcceptRequest: string = base + '/';
export const DenyRequest: string = base + '/';

// Notification
