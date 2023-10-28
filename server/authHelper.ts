import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/supabase';
import { decodeIdToken, type tokenProps } from '~/app_modules/cognito';

import type { H3Event } from 'h3'

export async function isAuthorised(event: H3Event): Promise<boolean> {

    let isAuthorised = true;
  
    // Check for Sb auth first
    const client = await serverSupabaseClient<Database>(event);
    const { user } = (await client.auth.getUser()).data;
    
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

    return isAuthorised;
}