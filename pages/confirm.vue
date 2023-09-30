<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo('/tools')
  }
}, { immediate: true })
</script>

<template>
  <div>
    <p class="">
      Redirecting...
    </p>
  </div>
</template>