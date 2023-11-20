<script setup>

  const props = defineProps(['label', 'for', 'invalid']);
  const labelFor = props.for;

</script>

<template>
  <div class="field">
    <label :for="labelFor">{{ label }}</label>
    <slot :pInvalid="invalid"></slot>
    <small class="p-error" v-if="invalid">{{ label }} is required.</small>
  </div>
</template>

<!-- <InputField label="Weight" for="weight" :invalid="(submitted||editing) && !tool.weight" v-slot="sp">
  <InputNumber id="weight" v-model.trim="tool.weight" :maxFractionDigits="10" suffix=" kg" required="true" :class="{'p-invalid': sp.pInvalid}" />
</InputField> -->
