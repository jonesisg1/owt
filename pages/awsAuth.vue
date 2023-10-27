<script setup lang="ts">

    const store  = useGlobalStore();
    const route = useRoute()
    const idToken = route.hash.substring(1).split('&').find((element)=> element.split('=')[0]='id_token')?.split('=')[1];

    // const idToken = (Array.isArray(route.query.id_token)) ? route.query.id_token[0] : route.query.id_token;
    if (!process.server) {
        console.log('hello client')
        const runtimeConfig = useRuntimeConfig();
        // Verifier that expects valid access tokens:
        console.log(`pool=${runtimeConfig.public.cognitoUserPoolId} client=${runtimeConfig.public.cognitoAppClientId} token=${idToken}`)
        console.log('hello client 2')
        await store.logInAwsUser(idToken||'');
        if(store.user.email){
            navigateTo('tools');
        } else {
            navigateTo('/');
        }
    }

</script>

<template>
    <p>Authorising...</p>
</template>