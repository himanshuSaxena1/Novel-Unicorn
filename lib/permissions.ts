export const PERMISSIONS = {
  CREATE_NOVEL: "create_novel",
  EDIT_NOVEL: "edit_novel",
  DELETE_NOVEL: "delete_novel",
  PUBLISH_NOVEL: "publish_novel",
  CREATE_CHAPTER: "create_chapter",
  EDIT_CHAPTER: "edit_chapter",
  DELETE_CHAPTER: "delete_chapter",
  PUBLISH_CHAPTER: "publish_chapter",
  MANAGE_USERS: "manage_users",
  BAN_USERS: "ban_users",
  MANAGE_SETTINGS: "manage_settings",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_PAYMENTS: "manage_payments",
  MANAGE_SUBSCRIPTIONS: "manage_subscriptions",
  MODERATE_CONTENT: "moderate_content",
  MODERATE_REVIEWS: "moderate_reviews",
} as const;

// Define types
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type Role = keyof typeof ROLE_PERMISSIONS;

export const ROLE_PERMISSIONS = {
  USER: [] as Permission[],
  AUTHOR: [
    PERMISSIONS.CREATE_NOVEL,
    PERMISSIONS.EDIT_NOVEL,
    PERMISSIONS.CREATE_CHAPTER,
    PERMISSIONS.EDIT_CHAPTER,
    PERMISSIONS.PUBLISH_CHAPTER,
  ],
  TRANSLATOR: [PERMISSIONS.CREATE_CHAPTER, PERMISSIONS.EDIT_CHAPTER],
  EDITOR: [
    PERMISSIONS.EDIT_NOVEL,
    PERMISSIONS.EDIT_CHAPTER,
    PERMISSIONS.MODERATE_CONTENT,
  ],
  MODERATOR: [
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.MODERATE_REVIEWS,
    PERMISSIONS.BAN_USERS,
  ],
  ADMIN: Object.values(PERMISSIONS),
} as const;

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[userRole] as Permission[]).includes(permission);
}

export function canAccessAdminPanel(userRole: Role): boolean {
  return ["ADMIN", "MODERATOR", "EDITOR"].includes(userRole);
}
