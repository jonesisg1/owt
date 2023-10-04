<script setup lang="ts">

  const { auth } = useSupabaseClient()

  const email = ref();
  const password = ref();
  const invalid = ref();

  async function onSubmit () {
    const { data, error } = await auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if(data.session){
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

      </form>
    </Fieldset>
  </div>
</template>