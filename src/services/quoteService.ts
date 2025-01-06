import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface SaveQuoteParams {
  builderName: string;
  jobName: string;
  items: any[];
  userId: string;
}

export const saveQuote = async ({ builderName, jobName, items, userId }: SaveQuoteParams) => {
  const quoteId = uuidv4();
  const now = new Date().toISOString();

  const { data: quote, error: quoteError } = await supabase
    .from("Quote")
    .insert({
      id: quoteId,
      builderName,
      jobName,
      user_id: userId,
      updatedAt: now,
    })
    .select()
    .single();

  if (quoteError) throw quoteError;

  const itemsWithQuoteId = items.map((item) => ({
    id: uuidv4(),
    quoteId: quote.id,
    type: 'door' in item ? 'door' : 'window',
    width: item.width,
    height: item.height,
    style: 'door' in item ? item.panelType : item.style,
    subStyle: 'door' in item ? item.handing : item.subOption,
    material: item.material || null,
    color: item.color || null,
    productNumber: null,
    updatedAt: now,
  }));

  const { error: itemsError } = await supabase
    .from("OrderItem")
    .insert(itemsWithQuoteId);

  if (itemsError) throw itemsError;

  return quote;
};