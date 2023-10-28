<script setup lang="ts">
    import { getIdTokenFromHash, decodeIdToken, type tokenProps } from '~/app_modules/cognito'
    const store  = useGlobalStore();
    const route = useRoute()
    const idToken = getIdTokenFromHash(route.hash);

    // const idToken = (Array.isArray(route.query.id_token)) ? route.query.id_token[0] : route.query.id_token;
    if (!process.server) {
        console.log('hello client')
        
        const user: tokenProps = await decodeIdToken(idToken);
        if(user.email){
            store.$patch((store) => {
                store.email = user.email;
                store.nickName = user.nickName;
                store.IdP = 'aws';
                store.awsIdToken = idToken;
            })
            navigateTo('tools');
        } else {
            navigateTo('/');
        }
    }

</script>

<template>
    <p>Authorising...</p>
</template>