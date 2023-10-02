<script setup>
  const dayjs = useDayjs();
  const selectedTool = ref();
  const toolDialog = ref(false);
  const deleteToolDialog = ref(false);
  const tool = ref({});
  const submitted = ref(false);
  const editing = ref(false);
  const cursorWait = ref(false);

  const { data: tools, refresh } = await useFetch('/api/tools', { headers: useRequestHeaders(['cookie']) });

  const columns = [
    { field:'asset_id', header:'Asset ID' },
    { field:'weight', header:'Weight' },
    { field:'length', header:'Length' },
    { field:'diameter', header:'Diameter' },
    { field:'location', header:'Location' }
    // Handle type and service_date in template.
  ];

  async function logout () {
    const client = useSupabaseClient();
    await client.auth.signOut();
    navigateTo('/');
  }

  function newTool () {
    tool.value = {};
    submitted.value = false;
    toolDialog.value = true;
  }

  function editTool () {
    tool.value = JSON.parse(JSON.stringify(selectedTool.value));
    tool.value.service_date = new Date(selectedTool.value.service_date);
    editing.value = true;
    toolDialog.value = true;
  }

  async function deleteTool () {
    deleteToolDialog.value = false;
    cursorWait.value = true;
    await $fetch( '/api/tools', {
      method: 'DELETE',
      body: {
        rowKey: selectedTool.value.asset_id
      }
    });
    refresh();
    selectedTool.value = null;
    cursorWait.value = false;
  }

  function hideDialog () {
    submitted.value = false;
    editing.value = false;
    toolDialog.value = false;
  }

  async function saveTool () {
    submitted.value = true;
    await nextTick();
    var elements = document.getElementsByClassName('p-invalid');
    if(elements.length > 0) {
      return;
    }
    cursorWait.value = true;
    hideDialog();
    if(tool.value.asset_id === undefined){
      await $fetch( '/api/tools', {
        method: 'POST',
        body: {
          rowData: tool.value
        }
      });
    } else {
      await $fetch( '/api/tools', {
        method: 'PATCH',
        body: {
          rowKey: selectedTool.value.asset_id,
          rowData: createPatch(selectedTool.value, tool.value)
        }
      });
      selectedTool.value = null;
    }
    refresh();
    cursorWait.value = false;
  }

  function createPatch (source, target) {
    // source object prperties from supabase are always strings
    let patch = {};
    let s, t;
    for(const prop in source) {
      if(target[prop] instanceof Date) {
        s = new Date(source[prop]).toISOString();
        t = target[prop].toISOString();
      } else {
        s = source[prop];
        t = target[prop];
      }
      if(s !== t) {
        patch[prop] = target[prop];
      }
    }
    return patch;
  }

</script>

<template>
  <div class="card" :class="{'cursor-wait': cursorWait}">
    <div class="fixed top-0 w-full min-w-max z-5">
      <Toolbar>
        <template #start>
          <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" size="small" @click="newTool" :disabled="cursorWait" />
          <Button label="Edit" icon="pi pi-pencil" class="mr-2" size="small" @click="editTool" :disabled="!selectedTool" />
          <Button label="Delete" icon="pi pi-trash" severity="danger" size="small" @click="deleteToolDialog = true" :disabled="!selectedTool" />
        </template>
        <template #end>
          <Button label="Quit" icon="pi pi-fw pi-power-off" size="small" @click="logout"  />
        </template>
      </Toolbar>
    </div>
   
    <DataTable v-model:selection="selectedTool" :value="tools" data-key="asset_id" tableStyle="min-width: 50rem" class="mt-8">
      <Column selectionMode="single" style="width: 3rem" :exportable="false"></Column>
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
      <column header="Type">
        <template #body="slotProps">
          {{ (slotProps.data.type === 1) ? 'Open hole' : 'Cased hole' }}
        </template>
      </column>
      <Column header="Service Date">
        <template #body="slotProps">
          {{ dayjs(slotProps.data.service_date).format('DD/MM/YYYY') }}
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="toolDialog" :style="{width: '450px'}" header="Tool Details" :modal="true" class="p-fluid">
      <div class="field">
        <label for="weight">Weight</label>
        <InputNumber id="weight" v-model.trim="tool.weight" :maxFractionDigits="10" suffix=" kg" required="true" autofocus :class="{'p-invalid': (submitted||editing) && !tool.weight}" />
        <small class="p-error" v-if="(submitted||editing) && !tool.weight">Weight is required.</small>
      </div>
      <div class="field">
        <label for="length">Length</label>
        <InputNumber id="length" v-model.trim="tool.length" :maxFractionDigits="10" suffix=" m" required="true" :class="{'p-invalid': (submitted||editing) && !tool.length}" />
        <small class="p-error" v-if="(submitted||editing) && !tool.length">Length is required.</small>
      </div>
      <div class="field">
        <label for="diameter">Diameter</label>
        <InputNumber id="diameter" v-model.trim="tool.diameter" :maxFractionDigits="10" suffix=" m" required="true" :class="{'p-invalid': (submitted||editing) && !tool.diameter}" />
        <small class="p-error" v-if="(submitted||editing) && !tool.diameter">Diameter is required.</small>
      </div>
      <div class="field">
        <label for="location">Location</label>
        <InputText id="location" v-model.trim="tool.location" required="true" :class="{'p-invalid': (submitted||editing) && !tool.location}" />
        <small class="p-error" v-if="(submitted||editing) && !tool.location">Location is required.</small>
      </div>
      <div class="field flex flex-wrap gap-3">
        <div class="flex align-items-center">
          <RadioButton v-model="tool.type" inputId="type1" :value="Number(1)" :class="{'p-invalid': (submitted||editing) && !tool.type}" />
          <label for="type1" class="ml-2">Open hole</label>
        </div>
        <div class="flex align-items-center">
          <RadioButton v-model="tool.type" inputId="type2" :value="Number(2)" :class="{'p-invalid': (submitted||editing) && !tool.type}" />
          <label for="type2" class="ml-2">Cased hole</label>
        </div>
        <small class="p-error" v-if="(submitted||editing) && !tool.type">Type is required.</small>
      </div>
      <div class="field">
        <label for="date">Service Date</label>
        <Calendar id="date" v-model="tool.service_date" dateFormat="dd/mm/yy" :class="{ 'p-invalid': (submitted||editing) && !tool.service_date }" />
        <small class="p-error" v-if="(submitted||editing) && !tool.service_date">Service date is required.</small>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Save" icon="pi pi-check" text @click="saveTool" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteToolDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Are you sure you want to delete this tool?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteToolDialog = false"/>
        <Button label="Yes" icon="pi pi-check" text @click="deleteTool" />
      </template>
    </Dialog>

  </div>
</template>

<style>
.p-toolbar {
  padding: 1rem;
  margin-right: 15px;
}
</style>
