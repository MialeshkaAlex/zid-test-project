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
                {{ dateFormatted }}
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
import { computed } from "vue";

const user = useUserStore();

const dateFormatted = computed(() => {
  return `${formatSingleNumber(user.dateOfBirth.getDate())}.${formatSingleNumber(user.dateOfBirth.getMonth()+1)}.${user.dateOfBirth.getFullYear()}`
});

const formatSingleNumber = function(number: number) {
  return number.toString().length === 1 ? `0${number}` : number;
};
</script>
