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
      <v-dialog
        v-model="store.loading"
        persistent
      >
        <v-card>
          <v-card-text>
            {{ store.loadingType === 'Payment' ? 'Your payment in progress' : 'Please stand by' }}
            <v-progress-linear indeterminate class="mb-0" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { mdiHome, mdiCreditCardOutline } from "@mdi/js";
import { useUserStore } from "@/store/store";

const route = useRoute();
const store = useUserStore();
</script>

<style scoped>

</style>
