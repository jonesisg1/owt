import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/supabase';
import { decodeIdToken, type tokenProps } from '~/app_modules/cognito';

export default defineEventHandler(async (event) => {

  const client = await serverSupabaseClient<Database>(event);
  
  // Check for Sb auth first
  const { user } = (await client.auth.getUser()).data;
  let isAuthorised = true;
  
  if (!user) {
    isAuthorised = false; // not logged in to Supabase
    // Now check for aws
    const authHeaders = event.node.req.headers.Authorization || event.node.req.headers.authorization;
    if(authHeaders){
      const authHeader: string = (Array.isArray(authHeaders)) ? authHeaders[0] : authHeaders
      const user: tokenProps = await decodeIdToken(authHeader.split(' ')[1]);
      if(user.email){
        isAuthorised = true; // user is logged into aws!
      } 
    }
    console.log(`Auth aws=${isAuthorised}`);
  } else {
    console.log(`Auth Supabase=${isAuthorised}`);
  }
  if(!isAuthorised) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
  
  const body = await readBody(event);
  const { error } = await client.from('tool').update(body.rowData).eq('asset_id', body.rowKey);

  return error;
})