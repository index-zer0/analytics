import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK as string, {
    apiVersion: "2020-08-27",
});

export const createCheckoutSession = async (
    customerID: string,
    price: string
) => {
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer: customerID,
        line_items: [
            {
                price,
                quantity: 1,
            },
        ],
        subscription_data: {
            trial_period_days: 14,
        },

        success_url: `${process.env.DOMAIN}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.DOMAIN}`,
    });

    return session;
};

export const createBillingSession = async (customer: string) => {
    const session = await stripe.billingPortal.sessions.create({
        customer,
        return_url: "https://localhost:4242",
    });
    return session;
};

export const getCustomerByID = async (id: string) => {
    const customer = await stripe.customers.retrieve(id);
    return customer;
};

export const addNewCustomer = async (email: string) => {
    const customer = await stripe.customers.create({
        email,
        description: "New Customer",
    });

    return customer;
};

/*
export const createWebhook = (rawBody, sig) => {
    const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
};
*/
