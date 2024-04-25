import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();

// 持久化 store
pinia.use(piniaPluginPersistedstate);

export const store = pinia;

export * from './common';
export * from './picture';
export * from './text';
export * from './file'