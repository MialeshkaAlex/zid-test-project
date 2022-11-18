<template>
  <v-container>
    <v-card>
      <v-card-text>
        {{ paymentStatus }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { useRoute } from "vue-router";

const paymentStatus = ref("");
const stripe = ref<Stripe | null>(null);
const router = useRoute();

onMounted(async () => {
  try {
    stripe.value = await loadStripe(
      "pk_test_51M4kcfJsZpofWx254EfiHavR9XcFjiwNO6QUmgVuLQusG1DofOdrNLW9ZhHmVniBMA9fg5ygsQx2czSwWUqawN6p00R88FRDL8"
    );
    paymentStatus.value = await getStatusMessage();
  } catch (err) {
    console.error("Fail to load stripe", err);
  }
});

const getStatusMessage = async function (): Promise<string> {
  const clientSecret = router.query["payment_intent_client_secret"];

  if (!clientSecret || !stripe.value) {
    return "Something went wrong.";
  }

  const { paymentIntent } = await stripe.value.retrievePaymentIntent(
    clientSecret
  );

  switch (paymentIntent?.status) {
    case "succeeded":
      return "Payment succeeded!";
    case "processing":
      return "Your payment is processing.";
    case "requires_payment_method":
      return "Your payment was not successful, please try again.";
    default:
      return "Something went wrong.";
  }
};
</script>

<style scoped></style>
