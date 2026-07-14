import { Wallet } from 'lucide-react';

export type PaymentMethod = 'visa' | 'mastercard' | 'gcash' | 'maya';

export type CardDetails = {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
};

const CARD_METHODS: { id: PaymentMethod; label: string; logo: string }[] = [
  { id: 'visa', label: 'Visa', logo: '/image/visalogo.png' },
  { id: 'mastercard', label: 'Mastercard', logo: '/image/mastercardlogo.png' },
];

const EWALLET_METHODS: { id: PaymentMethod; label: string; logo: string }[] = [
  { id: 'gcash', label: 'GCash', logo: '/image/gcashlogo.png' },
  { id: 'maya', label: 'Maya', logo: '/image/mayalogo.png' },
];

const METHODS = [...CARD_METHODS, ...EWALLET_METHODS];

function inputClass() {
  return 'rounded-lg border border-ink/15 bg-linen px-3 py-2.5 text-sm text-ink outline-none transition focus:border-ink/40';
}

type PaymentMethodSectionProps = {
  method: PaymentMethod | null;
  onChangeMethod: (method: PaymentMethod) => void;
  cardDetails: CardDetails;
  onChangeCardDetails: (details: CardDetails) => void;
};

export function PaymentMethodSection({
  method,
  onChangeMethod,
  cardDetails,
  onChangeCardDetails,
}: PaymentMethodSectionProps) {
  const isCard = method === 'visa' || method === 'mastercard';
  const isWallet = method === 'gcash' || method === 'maya';
  const walletLabel = METHODS.find((item) => item.id === method)?.label;

  return (
    <div className="mt-5 border-t border-ink/10 pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/50">Payment method</p>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {METHODS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChangeMethod(item.id)}
            className={`flex h-14 flex-col items-center justify-center gap-1 rounded-xl border transition ${
              method === item.id ? 'border-ink bg-ink/5' : 'border-ink/12 hover:border-ink/30'
            }`}
            aria-pressed={method === item.id}
          >
            <img src={item.logo} alt={item.label} className="h-4 object-contain" />
            <span className="text-[0.6rem] font-bold uppercase tracking-wide text-ink/60">{item.label}</span>
          </button>
        ))}
      </div>

      {isCard ? (
        <div className="mt-4 grid gap-3">
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-ink/50">
            Name on card
            <input
              value={cardDetails.name}
              onChange={(e) => onChangeCardDetails({ ...cardDetails, name: e.target.value })}
              className={inputClass()}
              placeholder="Juan Dela Cruz"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-ink/50">
            Card number
            <input
              value={cardDetails.number}
              onChange={(e) => onChangeCardDetails({ ...cardDetails, number: e.target.value })}
              className={inputClass()}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-ink/50">
              Expiry (MM/YY)
              <input
                value={cardDetails.expiry}
                onChange={(e) => onChangeCardDetails({ ...cardDetails, expiry: e.target.value })}
                className={inputClass()}
                placeholder="MM/YY"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-ink/50">
              CVV
              <input
                value={cardDetails.cvv}
                onChange={(e) => onChangeCardDetails({ ...cardDetails, cvv: e.target.value })}
                className={inputClass()}
                placeholder="CVV"
                inputMode="numeric"
              />
            </label>
          </div>
        </div>
      ) : null}

      {isWallet ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-ink/12 bg-linen p-4 text-sm text-ink/70">
          <Wallet size={18} className="mt-0.5 shrink-0 text-palm" strokeWidth={1.75} />
          <p>You&apos;ll be redirected to {walletLabel} to complete this payment after confirming.</p>
        </div>
      ) : null}
    </div>
  );
}
