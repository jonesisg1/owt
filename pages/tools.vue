<script setup>
  import { getCognitoSignOutUrl } from '~/app_modules/cognito';
  import { FilterMatchMode, FilterOperator } from 'primevue/api';

  console.log('tools <script setup>');
  const store = useGlobalStore();
  console.log(`From store! ${store.email}`);

  const selectedTool = ref();
  const toolDialog = ref(false);
  const deleteToolDialog = ref(false);
  const tool = ref({});
  const submitted = ref(false);
  const editing = ref(false);
  const cursorWait = ref(false);

  // const user = useSupabaseUser();

  const { data: tools, refresh } = await useFetch('/api/tools', {
    headers: useRequestHeaders(['cookie']),
    transform: (tools) => {
      // Transform the enum and date text into text and Date data type so that they can be searched in the data table.
      return tools.map((tool) => {
        tool.type = (tool.type === 1) ? 'Open hole' : 'Cased hole'
        tool.service_date = new Date(tool.service_date);
        return tool;
       })
  }
  });

  const columns = [
    { field:'asset_id', header:'Asset ID' },
    { field:'type', header:'Type' },
    { field:'weight', header:'Weight' },
    { field:'length', header:'Length' },
    { field:'diameter', header:'Diameter' },
    { field:'location', header:'Location' },
    // { field:'service_date', header: 'Service Date'}
    // Handle type and service_date in template.
  ];

  const menu = ref();
  const menuItems = ref([{
    label: store.email,
    items: [{
      label: `Logout (${store.IdP})` ,
      icon: 'pi pi-fw pi-power-off',
      command: () => {logout(); }
    }]
  }])

  function menuClick (event) {
    menu.value.toggle(event);
  }

  async function logout () {
    if(store.IdP === 'Supabase') {
      const client = useSupabaseClient();
      await client.auth.signOut();
      navigateTo('/');
    } else if(store.IdP === 'aws') {
      navigateTo(getCognitoSignOutUrl(), { external: true });
    }
  }

  async function showDialog () {
    toolDialog.value = true;
    await nextTick();
    if(tool.value.asset_id === undefined) {
      document.getElementById('ipType1').focus();
    } else {
      document.getElementById((selectedTool.value.type === 'Open hole') ? 'ipType1' : 'ipType2').focus();
    }
  }

  function newTool () {
    tool.value = {};
    submitted.value = false;
    editing.value = false;
    showDialog();
  }

  function editTool () {
    tool.value = JSON.parse(JSON.stringify(selectedTool.value));
    tool.value.service_date = new Date(selectedTool.value.service_date);
    editing.value = true;
    showDialog();
  }

  async function deleteTool () {
    deleteToolDialog.value = false;
    cursorWait.value = true;
    await $fetch( '/api/tools', {
      method: 'DELETE',
      body: {
        rowKey: selectedTool.value.asset_id
      }
    }).catch((err) => alert(err.message));
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
    const authHeader = (store.IdP === 'aws') ? { Authorization: `Bearer ${store.awsIdToken}` } : '';
    // console.log(authHeader)
    if(tool.value.asset_id === undefined){
      await $fetch( '/api/tools', {
        method: 'POST',
        headers: authHeader,
        body: {
          rowData: createPatch(
            {
              weight: null,
              length: null,
              diameter: null,
              location: null,
              type: null,
              service_date: new Date() 
            },
            tool.value
          )
        }
      }).catch((err) => alert(err.message));
    } else {
    
      await $fetch( '/api/tools', {
        method: 'PATCH',
        headers: authHeader,
        body: {
          rowKey: selectedTool.value.asset_id,
          rowData: createPatch(selectedTool.value, tool.value)
        }
      }).catch((err) => alert(err.message));
      
      selectedTool.value = null;
    }
    await refresh();
    cursorWait.value = false;
  }

  function createPatch (source, target) {
    // source object properties from supabase are always strings
    console.log(source)
    console.log(target)
    let patch = {};
    let s, t;
    for(const prop in source) {
      if(target[prop] instanceof Date) {
        s = source[prop].toISOString();
        t = target[prop].toISOString();
      } else {
        s = source[prop];
        t = target[prop];
      }
      if(s !== t) {
        if(prop === 'type') {
          patch[prop] = (t === 'Open hole') ? 1 : 2;
        } else {
          patch[prop] = target[prop];
        }
      }
    }
    // console.log(patch)
    return patch;
  }

  // ToolBar icons only for small screens
  const winSmall = ref(false);
  const toggleSearch = ref(false);
  function onResize() {
    winSmall.value = (window.innerWidth > 400) ? false : true;
    toggleSearch.value = (window.innerWidth > 700) ? false : true;
  }

  onMounted(() => {
    nextTick(() => {
      onResize()
      window.addEventListener('resize', onResize)
    })
  })

  // DataTable filter logic
  const filters = ref();
  const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        asset_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        weight: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        length: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        diameter: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        location: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        service_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
  };
  
  initFilters();

  function clearFilter () {
    initFilters();
  };
  
</script>

<template>
  <div class="card" :class="{'cursor-wait': cursorWait}">
    <div class="fixed top-0 w-full min-w-max z-5" style="background-color: white;">
      <Toolbar>
        <template #start>
          <Button icon="pi pi-plus" :label="(winSmall) ? null : 'New'" severity="success" class="mr-2" size="small" @click="newTool" :disabled="cursorWait" />
          <Button icon="pi pi-pencil" :label="(winSmall) ? null : 'Edit'" class="mr-2" size="small" @click="editTool" :disabled="!selectedTool" />
          <Button icon="pi pi-trash" :label="(winSmall) ? null : 'Delete'" severity="danger" size="small" @click="deleteToolDialog = true" :disabled="!selectedTool" />
        </template>
        <template v-if="!toggleSearch" #center>
          <SearchInput v-model="filters['global'].value" @clear-filter="clearFilter()" />
        </template>
        <template #end>
          <Button icon="pi pi-user"  size="small" @click="menuClick" />
          <Menu ref="menu" :model="menuItems" :popup="true" :pt="{ root: {class: 'min-w-max'} }" />
        </template>
      </Toolbar>
    </div>
   
    <DataTable v-model:filters="filters" v-model:selection="selectedTool" :value="tools" data-key="asset_id" tableStyle="min-width: 50rem" class="mt-8" filterDisplay="menu" :globalFilterFields="['asset_id', 'weight', 'length', 'diameter', 'location', 'service_date', 'type']">
      <template v-if="toggleSearch" #header>
        <SearchInput v-model="filters['global'].value" @clear-filter="clearFilter()" />
      </template>
      <Column selectionMode="single" style="width: 3rem" :exportable="false"></Column>
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
      <Column header="Service Date">
        <template #body="slotProps">
          {{ slotProps.data.service_date.toLocaleDateString('en-GB') }}
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="toolDialog" :style="{width: '450px'}" header="Tool Details" :modal="true" class="p-fluid" :breakpoints="{ '600px': '100vw' }">
      <div class="field flex flex-wrap gap-3 mt-1">
        <div class="flex align-items-center">
          <RadioButton id="type1" v-model="tool.type" inputId="ipType1" value="Open hole" :class="{'p-invalid': (submitted||editing) && !tool.type}" />
          <label for="type1" class="ml-2">Open hole</label>
        </div>
        <div class="flex align-items-center">
          <RadioButton id="type2" v-model="tool.type" inputId="ipType2" value="Cased hole" :class="{'p-invalid': (submitted||editing) && !tool.type}" />
          <label for="type2" class="ml-2">Cased hole</label>
        </div>
        <small class="p-error" v-if="(submitted||editing) && !tool.type">Type is required.</small>
      </div>
      <div class="field">
        <label for="weight">Weight</label>
        <InputNumber id="weight" v-model.trim="tool.weight" :maxFractionDigits="10" suffix=" kg" required="true" :class="{'p-invalid': (submitted||editing) && !tool.weight}" />
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
    padding: 0.5rem;
    margin-right: 15px;
    margin-top: 10px;
  }
</style>
