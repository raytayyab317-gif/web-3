import { FormEvent, useState } from 'react';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';
import {
  GTA_CITIES,
  GtaCity,
  PROJECT_CATEGORIES,
  PageRoute,
  ProjectCategory,
  ProjectFormInput,
} from '../types/constructex';

interface ContactViewProps {
  onCreateEstimateFromInquiry: (input: ProjectFormInput) => void;
  onNavigate: (route: PageRoute) => void;
}

const FORMSUBMIT_EMAIL = 'raytayyab317@gmail.com';
export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;
export const FORMSUBMIT_ACTION = `https://formsubmit.co/${FORMSUBMIT_EMAIL}`;

export default function ContactView({
  onCreateEstimateFromInquiry,
  onNavigate,
}: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState<GtaCity>('Toronto');
  const [category, setCategory] = useState<ProjectCategory>('Luxury Residential');
  const [squareFootage, setSquareFootage] = useState('2500');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedState, setSubmittedState] = useState<{
    title: string;
    emailed: boolean;
    note: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedDetails = details.trim();
    const sqFt = Math.max(100, Number(squareFootage) || 2500);

    if (trimmedName.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (trimmedDetails.length < 8) {
      setError('Please provide brief project details (at least 8 characters).');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const projectTitle = `${city} ${category} Inquiry (${trimmedName})`;
    const estimatedCad = Math.round(sqFt * 6.5);

    onCreateEstimateFromInquiry({
      title: projectTitle,
      clientName: trimmedName,
      city,
      category,
      squareFootage: String(sqFt),
      estimateAmount: String(estimatedCad),
      status: 'Pending Quote',
      targetDate: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
      notes: `${trimmedEmail} — ${trimmedDetails}`,
    });

    let emailed = false;
    let deliveryNote = `Your inquiry has been dispatched via FormSubmit to ${FORMSUBMIT_EMAIL} and saved to your Local Storage Project Ledger.`;

    try {
      await axios.post(
        FORMSUBMIT_ENDPOINT,
        {
          name: trimmedName,
          email: trimmedEmail,
          city,
          category,
          squareFootage: `${sqFt} sq ft`,
          estimatedCad: `$${estimatedCad.toLocaleString()} CAD`,
          message: trimmedDetails,
          _subject: `ConstructEx Estimate Request: ${projectTitle}`,
          _template: 'table',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 10000,
        }
      );
      emailed = true;
    } catch {
      deliveryNote = `Saved "${projectTitle}" to your Local Storage Project Ledger. Email dispatch to ${FORMSUBMIT_EMAIL} could not be confirmed from this network.`;
    } finally {
      setIsSubmitting(false);
    }

    setSubmittedState({
      title: projectTitle,
      emailed,
      note: deliveryNote,
    });
    setName('');
    setEmail('');
    setDetails('');
  };

  return (
    <section className="pt-28 pb-20 px-6 bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 md:p-10 rounded-2xl border border-slate-200">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold text-[#7C3AED] mb-2">
            GTA Estimating Desk
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Have a drywall or commercial framing project in mind? Submit your scope to notify our estimating desk and log a quote in the Project Ledger.
          </p>
        </div>

        {submittedState ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                {submittedState.emailed
                  ? 'Estimate Request Sent & Logged'
                  : 'Estimate Request Logged'}
              </h2>
              <p className="text-sm text-slate-600 mt-1">{submittedState.note}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="px-5 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold cursor-pointer"
              >
                View in Project Ledger
              </button>
              <button
                type="button"
                onClick={() => setSubmittedState(null)}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-sm font-semibold cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <form
            action={FORMSUBMIT_ACTION}
            method="POST"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <input
              type="hidden"
              name="_subject"
              value="ConstructEx Estimate Inquiry"
            />
            <input type="hidden" name="_template" value="table" />

            {error && (
              <div
                role="alert"
                className="px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="contact-city"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  GTA City
                </label>
                <select
                  id="contact-city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value as GtaCity)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:outline-none"
                >
                  {GTA_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-category"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Service Type
                </label>
                <select
                  id="contact-category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:outline-none"
                >
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-sqft"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Approx. Sq Ft
                </label>
                <input
                  id="contact-sqft"
                  name="squareFootage"
                  type="number"
                  min="100"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-details"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Project Details
              </label>
              <textarea
                id="contact-details"
                name="message"
                rows={4}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us about your drywall, steel framing, or Level-5 finishing project..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-[#7C3AED] focus:outline-none resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Sending Estimate Request...' : 'Send Estimate Request'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
