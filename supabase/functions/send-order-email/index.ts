import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const generateOrderHTML = (builderName: string, jobName: string, items: any[]) => {
  const itemsHtml = items.map((item) => {
    if ('door' in item) {
      return `<tr>
        <td>Door</td>
        <td>${item.panelType} ${item.width}″×${item.height}″ - ${item.handing} ${item.slabType} ${item.hardwareType}</td>
        <td>${item.notes || '-'}</td>
      </tr>`;
    } else {
      return `<tr>
        <td>Window</td>
        <td>${item.style}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material}</td>
        <td>${item.notes || '-'}</td>
      </tr>`;
    }
  }).join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Order Details</h1>
        <p><strong>Builder Name:</strong> ${builderName}</p>
        <p><strong>Job Name:</strong> ${jobName}</p>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Details</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { userEmail, builderName, jobName, items } = await req.json();
    console.log("Received request:", { userEmail, builderName, jobName, items });

    const htmlContent = generateOrderHTML(builderName, jobName, items);

    // Send email using Supabase SMTP
    const { error } = await supabase.auth.admin.sendEmail(
      userEmail,
      {
        subject: `Order Details - ${jobName}`,
        template_name: 'order-details',
        template_data: {
          builderName,
          jobName,
          content: htmlContent,
        }
      }
    );

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully");
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-order-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);