import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  userId: string;
  userEmail: string;
  builderName: string;
  jobName: string;
  items: any[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, builderName, jobName, items }: OrderEmailRequest = await req.json();
    console.log("Received request:", { userEmail, builderName, jobName, items });

    // Generate HTML content for items
    const itemsHtml = items.map((item) => {
      if ('door' in item) {
        return `<li>Door: ${item.panelType} ${item.width}″×${item.height}″ - ${item.handing} ${item.slabType} ${item.hardwareType} - Measurement Given: ${item.measurementGiven}${item.notes ? ` - Note: ${item.notes}` : ''}</li>`;
      } else {
        return `<li>Window: ${item.style}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material} - Measurement Given: ${item.measurementGiven}${item.notes ? ` - Note: ${item.notes}` : ''}</li>`;
      }
    }).join("");

    const emailHtml = `
      <html>
        <body>
          <h1>Order Details</h1>
          <p><strong>Builder Name:</strong> ${builderName}</p>
          <p><strong>Job Name:</strong> ${jobName}</p>
          <h2>Items:</h2>
          <ul>
            ${itemsHtml}
          </ul>
          <p>Please print this email to PDF for your records.</p>
        </body>
      </html>
    `;

    console.log("Sending email to:", userEmail);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "micah@bradley.build",
        to: [userEmail],
        subject: `Order Details - ${jobName}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-order-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);