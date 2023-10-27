<script setup lang="ts">

  const { auth } = useSupabaseClient()
  const store  = useGlobalStore();

  const email = ref();
  const password = ref();
  const invalid = ref();

  async function onSubmit () {
    const { data, error } = await auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if(data.session){
      store.logInSbUser(data.user.email||'')
      navigateTo('/tools')
    } else {
      invalid.value = error?.message;
    }
  };

</script>

<template>
  <div class="flex justify-content-center mt-6">
    <Fieldset legend="Sign in">
      <form @submit="onSubmit" class="flex flex-column gap-4">

        <div class="flex flex-column gap-2">
          <label for="email">Email</label>
          <InputText id="email" v-model:model-value="email" :class="{'p-invalid': invalid}" autocomplete="on" autofocus="true">
          </InputText>
        </div>

        <div class="flex flex-column gap-2">
          <label for="password">Password</label>
          <Password id="password" :class="{'p-invalid': invalid}" v-model:model-value="password" :feedback="false" toggleMask autocomplete="on">
          </Password>      
          <small class="p-error" id="text-error">{{ invalid || '&nbsp;' }}</small>
        </div>

        <Button label="Sign in" @click="onSubmit" :disabled="!(email&&password)"/>
        <a href="https://owt.auth.eu-west-2.amazoncognito.com/login?response_type=token&client_id=63bife1al52prp81olr3hq0v49&redirect_uri=http://localhost:3000/awsAuth">or use aws Cognito</a>

      </form>
    </Fieldset>
  </div>
</template>