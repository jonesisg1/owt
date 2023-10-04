
import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
// import Card from "primevue/card";
import Fieldset from "primevue/fieldset";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import Menubar from "primevue/menubar";
import Toolbar from "primevue/toolbar";
import Dialog from "primevue/dialog";
import RadioButton from "primevue/radiobutton";
import Calendar from "primevue/calendar";
import Menu from "primevue/menu";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true });
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("InputNumber", InputNumber);
    nuxtApp.vueApp.component("InputText", InputText);
    nuxtApp.vueApp.component("Password", Password);
    // nuxtApp.vueApp.component("Card", Card);
    nuxtApp.vueApp.component("Fieldset", Fieldset);
    nuxtApp.vueApp.component("DataTable", DataTable);
    nuxtApp.vueApp.component("Column", Column);
    // nuxtApp.vueApp.component("Menubar", Menubar);
    nuxtApp.vueApp.component("Toolbar", Toolbar);
    nuxtApp.vueApp.component("Dialog", Dialog);
    nuxtApp.vueApp.component("RadioButton", RadioButton);
    nuxtApp.vueApp.component("Calendar", Calendar);
    nuxtApp.vueApp.component("Menu", Menu);
    //other components that you need
});
