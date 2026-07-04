export const USER_TYPE = {
  CREW: 'CREW',
  COMPANY: 'COMPANY',
} as const;

export type UserType = (typeof USER_TYPE)[keyof typeof USER_TYPE];

export interface User {
  userId: number;
  email: string;
  userType: UserType;
  hasFullInfo: boolean;
}
