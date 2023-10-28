import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => {
    return { 
        awsIdToken: '',
        email: '',
        nickName: '',
        IdP: '',
     }
  }
})