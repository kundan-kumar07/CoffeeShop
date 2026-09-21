import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

const sendOrderStatusEmail = async ({
    email,
    customerName,
    orderId,
    status,
}) => {
    try {
        const statusMessages = {
            paid: "Your order has been confirmed and payment was successful.",
            preparing: "Your order is now being prepared by our team.",
            ready: "Your order is ready for pickup.",
            out_for_delivery:
                "Your order is out for delivery and will reach you soon.",
            delivered:
                "Your order has been delivered. We hope you enjoy your coffee!",
            cancelled:
                "Your order has been cancelled.",
        };

        const message =
            statusMessages[status] ||
            `Your order status has been updated to ${status}.`;

        await brevo.transactionalEmails.sendTransacEmail({
            subject: `CoffeeShop Order #${orderId} Update`,

            sender: {
                name: process.env.BREVO_SENDER_NAME,
                email: process.env.BREVO_SENDER_EMAIL,
            },

            to: [
                {
                    email,
                    name: customerName || "Customer",
                },
            ],

            htmlContent: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    background: #fffaf0;
                ">

                    <h1 style="color: #292524;">
                        ☕ CoffeeShop
                    </h1>

                    <p style="font-size: 16px; color: #44403c;">
                        Hi ${customerName || "Customer"},
                    </p>

                    <p style="font-size: 16px; color: #44403c;">
                        Your order
                        <strong>#${orderId}</strong>
                        has been updated.
                    </p>

                    <div style="
                        margin: 25px 0;
                        padding: 20px;
                        background: #ffffff;
                        border-radius: 12px;
                    ">

                        <p style="
                            margin: 0;
                            color: #78716c;
                        ">
                            Current Status
                        </p>

                        <h2 style="
                            margin-top: 8px;
                            color: #b45309;
                        ">
                            ${status.replaceAll("_", " ").toUpperCase()}
                        </h2>

                        <p style="color: #44403c;">
                            ${message}
                        </p>

                    </div>

                    <p style="
                        font-size: 14px;
                        color: #78716c;
                    ">
                        Thank you for ordering from CoffeeShop ☕
                    </p>

                </div>
            `,
        });

        console.log(
            `Order status email sent to ${email} for order #${orderId}`
        );
    } catch (error) {
        console.error(
            "Failed to send order status email:",
            error
        );
    }
};

export default sendOrderStatusEmail;