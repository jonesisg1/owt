// stores/counter.js
import { defineStore } from 'pinia';

import { CognitoJwtVerifier } from "aws-jwt-verify";

export const useGlobalStore = defineStore('global', {
  state: () => {
    return { 
        user: {
            awsIdToken: '',
            email: '',
            nickName: '',
            IdP: '',
        },
     }
  },
  actions: {
    async logInAwsUser(token: string) {

        const runtimeConfig = useRuntimeConfig();
        // Verifier that expects valid access tokens:
        console.log(`pool=${runtimeConfig.public.cognitoUserPoolId} client=${runtimeConfig.public.cognitoAppClientId} token=${token}`)
        const verifier = CognitoJwtVerifier.create({
            userPoolId: runtimeConfig.public.cognitoUserPoolId,
            tokenUse: "id",
            clientId: runtimeConfig.public.cognitoAppClientId
          });

        try {
            const payload = await verifier.verify(token);
            this.user.email = payload.email?.toString() ||'';
            this.user.nickName = payload.nickname?.toString() ||'';
            this.user.awsIdToken = token;
            this.user.IdP = 'aws'
    
            console.log("Token is valid. Payload:", payload);
        } catch (err) {
            console.log(err);
            this.logOutUser();
        }

    },
    logInSbUser(email: string) {
        this.user.email = email;
        this.user.IdP = 'Supabase';
    },
    logOutUser() {
        this.user.email = '';
        this.user.nickName = '';
        this.user.awsIdToken = '';
        this.user.IdP = '';
    }
  },
})