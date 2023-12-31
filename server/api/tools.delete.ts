import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/supabase';
export default defineEventHandler(async (event) => {

  const client = await serverSupabaseClient<Database>(event);
  const { user } = (await client.auth.getUser()).data;
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
  
  const body = await readBody(event);
  const { error } = await client.from('tool').delete().eq('asset_id', body.rowKey);

  return error;
})