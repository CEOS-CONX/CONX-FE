export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP_USERINFO: '/api/auth/signup/userinfo',
    SIGNUP_CREW: '/api/auth/signup/crew',
    SIGNUP_COMPANY: '/api/auth/signup/company',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    EMAIL_SEND: '/api/auth/email/send',
    EMAIL_VERIFY: '/api/auth/email/verify',
    DELETE_ACCOUNT: '/api/account/delete',
  },
  PROJECT: {
    CREATE: '/api/projects/create',
    LIST: '/api/projects',
  },
  CREW: {
    LIST: '/api/crews',
  },
  FILE: {
    UPLOAD: '/api/files/upload',
  },
} as const;

export const COOKIE_CONFIG = {
  ACCESS_TOKEN: { name: 'accessToken', path: '/' },
  REFRESH_TOKEN: { name: 'refreshToken', path: '/api/auth' },
  USER: { name: 'user', path: '/' },
} as const;

export const BACKEND_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/login',
    SIGNUP_USERINFO_CREW: '/api/v1/auth/userinfo/crew',
    SIGNUP_USERINFO_COMPANY: '/api/v1/auth/userinfo/company',
    SIGNUP_SETTING_CREW: '/api/v1/auth/usersetting/crew',
    SIGNUP_SETTING_COMPANY: '/api/v1/auth/usersetting/company',
    LOGOUT: '/api/v1/logout',
    EMAIL_SEND: '/api/v1/auth/email/send',
    EMAIL_VERIFY: '/api/v1/auth/email/verify',
    REFRESH: '/api/v1/login/refresh',
    DELETE_ACCOUNT: '/api/v1/account/me',
  },
  PROJECT: {
    CREATE: '/api/v1/companies/me/projects',
    LIST: '/api/v1/projects',
  },
  CREW: {
    LIST: '/api/v1/crews',
  },
  FILE: {
    UPLOAD: '/api/v1/files/presigned-url',
  },
} as const;
