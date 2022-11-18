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
import { useUserStore } from "@/store/store";

const router = useRoute();
const store = useUserStore();

const appearance: Appearance = {
  theme: "stripe",
};
const items = [{ id: "test" }];
const errorMessage = ref("");
const showError = ref(false);
const paymentElementsReady = ref(false);

const stripe = ref<Stripe | null>(null);
const clientSecret = ref<StripeElementsOptions | null>(null);
const elements = ref<StripeElements | undefined>(undefined);
const paymentElements = ref<StripePaymentElement | undefined>(undefined);
const proceedPayment = ref(router.query.payment);

onMounted(async () => {
  store.loading = true;

  try {
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  } catch (err) {
    console.error("Fail to load stripe", err);
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/create-payment-intent`,
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
  paymentElements.value?.on("ready", () => {
    store.loading = false;
    paymentElementsReady.value = true;
  });
});

const handlePayment = async function (event: Event) {
  event.preventDefault();
  store.loading = true;
  store.loadingType = "Payment";
  if (!elements.value || !stripe.value) {
    store.loading = false;
    store.loadingType = "Default";
    return "Something went wrong.";
  }

  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    confirmParams: {
      return_url: `${window.location.origin}/status`,
    },
  });

  if (error.type === "card_error" || error.type === "validation_error") {
    errorMessage.value = error.message || "An unexpected error occurred.";
    store.loading = false;
    store.loadingType = "Default";
    showError.value = true;
  } else {
    errorMessage.value = "An unexpected error occurred.";
    store.loading = false;
    store.loadingType = "Default";
    showError.value = true;
  }
};
</script>

<style scoped></style>
