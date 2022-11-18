<template>
  <v-container>
    <v-card>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          class="ma-2"
          label="Full name"
          v-model="name"
          :rules="nameRules"
          required
        ></v-text-field>
        <v-select
          class="ma-2"
          label="Gender"
          :items="genders"
          v-model="gender"
          :rules="genderRules"
          required
        ></v-select>
        <v-text-field
          class="ma-2"
          label="Avatar URL"
          v-model="avatar"
          :rules="avatarRules"
          required
        ></v-text-field>
        <v-btn class="ma-4" color="primary" width="150" @click="validate"
          >Edit</v-btn
        >
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/store";
import { ref, VueElement } from "vue";
import router from "@/router";

const genders = ref(["Male", "Female", "Non-binary"]);
const form = ref<VueElement | null>(null);

const user = useUserStore();

const name = ref(user.name);
const gender = ref(user.gender);
const avatar = ref(user.avatar);

const valid = ref(true);
const nameRules = ref([
  (v: string) => !!v || "Name is required",
  (v: string) => (v && v.length >= 5) || "Name must be more than 5 characters",
]);
const genderRules = ref([(v: string) => !!v || "Gender is required"]);
const avatarRules = ref([
  (v: string) => !!v || "Avatar URL is required",
  (v: string) =>
    /(^(http:\/\/)|(https:\/\/))/gm.test(v) || "Avatar URL must be valid",
]);

const validate = function () {
  if (
    form.value &&
    (form.value as VueElement & { validate: () => boolean }).validate()
  ) {
    user.name = name.value;
    user.gender = gender.value;
    user.avatar = avatar.value;

    router.push({ name: "home" });
  }
};
</script>

<style scoped></style>
