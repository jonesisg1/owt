import { CognitoJwtVerifier } from "aws-jwt-verify";

export type tokenProps = {
    email: string;
    nickName: string;
}

export function getIdTokenFromHash (hash: string): string {
    return hash.substring(1).split('&').find((element)=> element.split('=')[0]='id_token')?.split('=')[1] || '';
}

export function getCognitoSignInUrl (): string {
    const runtimeConfig = useRuntimeConfig();
    const url = `${runtimeConfig.public.cognitoUserPoolDomain}/login?response_type=token&client_id=${runtimeConfig.public.cognitoAppClientId}&redirect_uri=${runtimeConfig.public.baseUrl}/awsAuth`;
    // console.log(url); 
    return url;
}

export function getCognitoSignOutUrl (): string {
    const runtimeConfig = useRuntimeConfig();
    return `${runtimeConfig.public.cognitoUserPoolDomain}/logout?client_id=${runtimeConfig.public.cognitoAppClientId}&logout_uri=${runtimeConfig.public.baseUrl}` 
}

export async function decodeIdToken(token: string): Promise<tokenProps> { 
    const runtimeConfig = useRuntimeConfig();
    // Verifier that expects valid access tokens:
    // console.log(`pool=${runtimeConfig.public.cognitoUserPoolId} client=${runtimeConfig.public.cognitoAppClientId} token=${token}`)
    const verifier = CognitoJwtVerifier.create({
        userPoolId: runtimeConfig.public.cognitoUserPoolId,
        tokenUse: "id",
        clientId: runtimeConfig.public.cognitoAppClientId
      });
    let tokenProps: tokenProps;
    try {
        const payload = await verifier.verify(token);
        tokenProps = <tokenProps>({
            email: payload.email?.toString(),
            nickName: payload.nickname?.toString()
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
    return tokenProps;
}