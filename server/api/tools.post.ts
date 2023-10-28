import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/supabase';
import { isAuthorised } from '~/server/authHelper'

export default defineEventHandler(async (event) => {

  if(! await isAuthorised(event)) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
  
  const client = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);
  const { error } = await client.from('tool').insert(body.rowData);

  return error;
})