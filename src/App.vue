<template>
  <v-app>
    <v-navigation-drawer expand-on-hover rail>
      <v-list density="compact" nav>
        <v-list-item :prepend-icon="mdiHome" title="Profile" value="profile" :to="{name: 'home'}"></v-list-item>
        <v-list-item :prepend-icon="mdiCreditCardOutline" title="Payment" value="payments" :to="{name: 'payment'}"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { mdiHome, mdiCreditCardOutline } from "@mdi/js";

</script>

<style scoped>

</style>
