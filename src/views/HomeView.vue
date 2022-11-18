<template>
  <v-container>
    <v-card>
      <v-col>
        <v-row>
          <v-col>
            <v-row>
              <v-avatar class="ma-2" rounded="circle" size="50">
                <v-img cover :src="user.avatar"></v-img>
              </v-avatar>
              <v-card-item :title="user.name" :subtitle="user.gender">
              </v-card-item>
            </v-row>
          </v-col>
          <v-col>
            <v-row align-content="end" justify="end">
              <v-btn
                class="ma-1"
                small
                :icon="mdiPencil"
                :to="{ name: 'edit' }"
              ></v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { mdiPencil } from "@mdi/js";
import { useUserStore } from "@/store/store";

const user = useUserStore();
</script>
