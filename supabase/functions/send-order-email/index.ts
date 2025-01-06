import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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

    // Initialize Supabase client with service role key
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Send email using Supabase's built-in email functionality
    const { error } = await supabase.auth.admin.createUser({
      email: userEmail,
      email_confirm: true,
      user_metadata: {
        orderEmail: true,
      },
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully to:", userEmail);

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);