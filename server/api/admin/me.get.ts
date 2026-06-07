import { requireAdmin } from '../../utils/admin';

export default defineEventHandler(async (event) => {
  const { userId } = await requireAdmin(event);

  return {
    user_id: userId,
  };
});
