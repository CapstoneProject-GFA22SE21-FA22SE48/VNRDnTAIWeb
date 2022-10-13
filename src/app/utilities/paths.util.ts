export const paths = {
  general: {
    default: '',
    notFound: '**',
    profile: 'profile',
    settings: 'settings',
    notifications: 'notifications',
  },
  admin: {
    dashboard: 'admin/dashboard',
    manageScribes: 'admin/manage-scribes',
    manageRoMs: 'admin/manage-roms',
    manageUsers: 'admin/manage-users'
  },
  scribe: {
    myRequests: 'scribe/my-request',
    manageLaws: 'scribe/manage-laws/:id',
    manageSigns: 'scribe/manage-signs',
    manageQuestions: 'scribe/manage-questions'
  }
};
