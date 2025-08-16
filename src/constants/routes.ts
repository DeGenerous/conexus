export const DASHBOARD_ROUTES = {
  HOME: '/dashboard',
  DREAM: '/dashboard/dream',
  CREATE: '/dashboard/dream/create',
  MANAGE: '/dashboard/dream/manage',
  EXPLORE: (topic_id: string) => `/dashboard/dream/manage/${topic_id}`,
  DEMO: '/dashboard/dream/manage/demo',
};
