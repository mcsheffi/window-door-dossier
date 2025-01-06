import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  userId: string;
  builderName: string;
  jobName: string;
  items: any[];
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, builderName, jobName, items, userEmail }: OrderEmailRequest = await req.json();

    // Generate HTML content for the email
    const itemsHtml = items.map((item) => {
      let details = "";
      if (item.type === "window") {
        details = `${item.style}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material}${item.notes ? ` - Note: ${item.notes}` : ''}`;
      } else {
        details = `${item.panelType} ${item.width}″×${item.height}″ ${item.handing} ${item.slabType} ${item.hardwareType} ${item.measurementGiven}${item.notes ? ` - Note: ${item.notes}` : ''}`;
      }
      return `<li>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${details}</li>`;
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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bradley Building Products <onboarding@resend.dev>",
        to: [userEmail],
        subject: `Order Details - ${jobName}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
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