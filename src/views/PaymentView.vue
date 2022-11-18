<template>
  <v-container class="d-flex align-center justify-center">
    <v-card v-if="!proceedPayment" v-show="paymentElementsReady" width="400">
      <v-form class="d-flex flex-column ma-3 mb-0">
        <div id="stripe-elements"></div>
        <v-btn
          class="align-self-center ma-3"
          width="200"
          color="success"
          @click="handlePayment"
        >
          Pay
        </v-btn>
      </v-form>
    </v-card>
    <v-snackbar color="error" v-model="showError">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showError = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
      v-model="loading"
      persistent
    >
      <v-card>
        <v-card-text>
          Your payment in progress
          <v-progress-linear indeterminate class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import type {
  Appearance,
  Stripe,
  StripeElements,
  StripeElementsOptions,
  StripePaymentElement,
} from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const router = useRoute();

const appearance: Appearance = {
  theme: "stripe",
};
const items = [{ id: "test" }];
const errorMessage = ref("");
const showError = ref(false);
const paymentElementsReady = ref(false);
const loading = ref(false);

const stripe = ref<Stripe | null>(null);
const clientSecret = ref<StripeElementsOptions | null>(null);
const elements = ref<StripeElements | undefined>(undefined);
const paymentElements = ref<StripePaymentElement | undefined>(undefined);
const proceedPayment = ref(router.query.payment);

onMounted(async () => {
  try {
    stripe.value = await loadStripe(
      "pk_test_51M4kcfJsZpofWx254EfiHavR9XcFjiwNO6QUmgVuLQusG1DofOdrNLW9ZhHmVniBMA9fg5ygsQx2czSwWUqawN6p00R88FRDL8"
    );
  } catch (err) {
    console.error("Fail to load stripe", err);
  }
  try {
    const response = await fetch(
      "http://localhost:4242/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }
    );
    clientSecret.value = await response.json();
  } catch (err) {
    console.error("Fail to fetch payment intent", err);
  }
  elements.value = stripe.value?.elements({
    appearance,
    clientSecret: clientSecret.value?.clientSecret,
  });
  paymentElements.value = elements.value?.create("payment");
  paymentElements.value?.mount("#stripe-elements");
  paymentElements.value?.on("ready", () => (paymentElementsReady.value = true));
});

const handlePayment = async function (event: Event) {
  event.preventDefault();
  loading.value = true;
  if (!elements.value || !stripe.value) {
    loading.value = false;
    return "Something went wrong.";
  }

  console.log(router);
  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    confirmParams: {
      return_url: `${window.location.origin}/status`,
    },
  });

  if (error.type === "card_error" || error.type === "validation_error") {
    errorMessage.value = error.message || "An unexpected error occurred.";
    loading.value = false;
    showError.value = true;
  } else {
    errorMessage.value = "An unexpected error occurred.";
    loading.value = false;
    showError.value = true;
  }
};
</script>

<style scoped></style>
