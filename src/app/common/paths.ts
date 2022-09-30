/* paths.ts was created to provide shrinked links for API calling. */
// Base path
const base = 'https://localhost:5001/api';

//Login
export const Login: string = base + "/Users/Login";

// Scribe
export const CreateScribe: string = base + '/';
export const UpdateScribe: string = base + '/';

// Request of Modification
export const AcceptRequest: string = base + '/';
export const DenyRequest: string = base + '/';

// Notification
