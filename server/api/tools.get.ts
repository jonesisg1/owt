import { serverSupabaseClient } from '#supabase/server';
export default defineEventHandler(async (event) => {

  const client = await serverSupabaseClient(event);
  // const { user } = (await client.auth.getUser()).data;
  
  // if (!user) {
  //   throw createError({
  //     statusCode: 401,
  //     message: 'Unauthorized',
  //   });
  // }

  const { data } = await client.from('tool').select('*').order('asset_id');

  return data;
})