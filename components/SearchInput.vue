<script setup>

  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue'])

  const value = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    }
  })

</script>

<template>
  <div class="p-inputgroup flex justify-content-center min-w-min">
    <span class="p-input-icon-left">
      <i class="pi pi-search" />
      <InputText v-model="value" placeholder="Keyword Search" size="small" :pt="{root: {class: 'inputgroup-icon-left-button-right'}}"/>
    </span>
    <Button type="button" icon="pi pi-filter-slash" @click="$emit('clearFilter')" size="small" class="mr-2"/>
  </div>
</template>

<style>
  .inputgroup-icon-left-button-right {
      width: auto;
      border-end-end-radius: 0%;
      border-start-end-radius: 0%;
    }
</style>