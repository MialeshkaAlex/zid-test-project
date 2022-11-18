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
        <v-text-field
          class="ma-2"
          label="Date of birth"
          v-model="dateOfBirth"
          :rules="dateOfBirthRules"
          placeholder="YYYY-MM-DD"
          required
        >
        </v-text-field>
        <v-btn class="ma-4" color="primary" width="150" @click="validate"
          >Edit</v-btn
        >
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/store";
import { computed, onMounted, ref, VueElement } from "vue";
import router from "@/router";

const genders = ref(["Male", "Female", "Non-binary"]);
const form = ref<VueElement | null>(null);

type Validation = {
  valid: boolean;
  errors: { id: string | number; errorMessages: string[] }[];
};

const formatToISO = computed(() => {
  return `${user.dateOfBirth.getFullYear()}-${formatSingleNumber(
    user.dateOfBirth.getMonth() + 1
  )}-${formatSingleNumber(user.dateOfBirth.getDate())}`;
});

const formatSingleNumber = function (number: number) {
  return number.toString().length === 1 ? `0${number}` : number;
};

const user = useUserStore();

const name = ref(user.name);
const gender = ref(user.gender);
const avatar = ref(user.avatar);
const dateOfBirth = ref("");

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
const dateOfBirthRules = ref([
  (v: string) => !!v || "Date of birth is required",
  (v: string) => /\d{4}-\d{2}-\d{2}/gm.test(v) || "Date of birth must be valid",
]);

onMounted(() => {
  dateOfBirth.value = formatToISO.value;
});

const validate = async function () {
  const validation = await (
    form.value as VueElement & { validate: () => Promise<Validation> }
  ).validate();

  if (form.value && validation.valid) {
    user.name = name.value;
    user.gender = gender.value;
    user.avatar = avatar.value;
    user.dateOfBirth = new Date(dateOfBirth.value);

    router.push({ name: "home" });
  }
};
</script>

<style scoped></style>
