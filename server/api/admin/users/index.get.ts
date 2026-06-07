import { requireAdmin } from '../../../utils/admin';

export default defineEventHandler(async (event) => {
  const { adminClient } = await requireAdmin(event);

  const [{ data: admins, error: adminsError }, { data: authUsers, error: usersError }] = await Promise.all([
    adminClient
      .from('admin_users')
      .select('user_id, created_at')
      .order('created_at', { ascending: false }),
    adminClient.auth.admin.listUsers(),
  ]);

  if (adminsError) {
    throw createError({
      statusCode: 500,
      statusMessage: adminsError.message,
    });
  }

  if (usersError) {
    throw createError({
      statusCode: 500,
      statusMessage: usersError.message,
    });
  }

  const usersById = new Map((authUsers.users ?? []).map((user) => [user.id, user]));

  return {
    users: (admins ?? []).map((admin) => {
      const user = usersById.get(admin.user_id);

      return {
        user_id: admin.user_id,
        email: user?.email ?? null,
        created_at: user?.created_at ?? null,
        admin_created_at: admin.created_at,
      };
    }),
  };
});
