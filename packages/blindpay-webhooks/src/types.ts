export type PayoutWebhookData = {
  id: string;
  status: 'processing' | 'failed' | 'refunded' | 'completed';
  sender_wallet_address: string;
  tracking_complete: {
    step: 'processing' | 'on_hold' | 'completed';
    status: string | null;
    transaction_hash: string | null;
    completed_at: string | null;
  };
  tracking_payment: {
    step: 'processing' | 'on_hold' | 'completed';
    provider_name: string | null;
    provider_transaction_id: string | null;
    provider_status: 'canceled' | 'failed' | 'returned' | 'sent';
    estimated_time_of_arrival: string | null;
    completed_at: string | null;
  };
  tracking_transaction: {
    step: 'processing' | 'on_hold' | 'completed';
    status: 'failed' | 'found' | null;
    transaction_hash: string | null;
    completed_at: string | null;
  };
};
