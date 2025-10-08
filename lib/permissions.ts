export const PERMISSIONS = {
  // Novel permissions
  CREATE_NOVEL: 'create_novel',
  EDIT_NOVEL: 'edit_novel',
  DELETE_NOVEL: 'delete_novel',
  PUBLISH_NOVEL: 'publish_novel',
  
  // Chapter permissions
  CREATE_CHAPTER: 'create_chapter',
  EDIT_CHAPTER: 'edit_chapter',
  DELETE_CHAPTER: 'delete_chapter',
  PUBLISH_CHAPTER: 'publish_chapter',
  
  // User permissions
  MANAGE_USERS: 'manage_users',
  BAN_USERS: 'ban_users',
  
  // Admin permissions
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_PAYMENTS: 'manage_payments',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  
  // Moderation permissions
  MODERATE_CONTENT: 'moderate_content',
  MODERATE_REVIEWS: 'moderate_reviews',
} as const

export const ROLE_PERMISSIONS = {
  USER: [],
  AUTHOR: [
    PERMISSIONS.CREATE_NOVEL,
    PERMISSIONS.EDIT_NOVEL,
    PERMISSIONS.CREATE_CHAPTER,
    PERMISSIONS.EDIT_CHAPTER,
    PERMISSIONS.PUBLISH_CHAPTER,
  ],
  TRANSLATOR: [
    PERMISSIONS.CREATE_CHAPTER,
    PERMISSIONS.EDIT_CHAPTER,
  ],
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
} as const

export function hasPermission(userRole: keyof typeof ROLE_PERMISSIONS, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission as any)
}

export function canAccessAdminPanel(userRole: string): boolean {
  return ['ADMIN', 'MODERATOR', 'EDITOR'].includes(userRole)
}