import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, useState, useRef } from "react";
import { employerAPI } from '../../services/api';

const PLAN_OPTIONS = [
  {
    key: 'trial',
    title: 'Trial',
    price: 'Gratuit (15 zile)',
    features: [
      '1 anunț (vizibilitate 15 zile)',
      'Contact direct cu aplicanții',
      'Statistici de bază - vizualizări per anunț'
    ],
    disabled: true,
    isAddon: false
  },
  {
    key: 'basic',
    title: 'Basic',
    price: <><span className="line-through text-gray-400 mr-2">$100</span><span className="text-green-700 font-bold">$49.99</span><span className="text-sm text-gray-500">/lună</span></>,
    features: [
      '5 anunțuri (vizibilitate 30 zile)',
      'Contact direct cu aplicanții',
      'Statistici de bază - vizualizări per anunț',
      'Acces la toți candidații',
      'Suport'
    ],
    priceId: 'price_1O8tq8vo26lc0v3ocmjctl8gact4gnfk1_basic',
    isAddon: false
  },
  {
    key: 'premium',
    title: 'Premium',
    price: <><span className="line-through text-gray-400 mr-2">$300</span><span className="text-green-700 font-bold">$149.99</span><span className="text-sm text-gray-500">/lună</span></>,
    features: [
      'Anunțuri nelimitate (vizibilitate 30 zile)',
      'Contact direct cu aplicanții',
      'Statistici de bază și extinse',
      'Acces la toți candidații',
      'Suport prioritar'
    ],
    priceId: 'price_1O8tq8vo26lc0v3ocmjctl8gact4gnfk1_premium',
    isAddon: false
  },
  {
    key: 'single',
    title: 'Anunț Unic',
    price: <><span className="line-through text-gray-400 mr-2">$30</span><span className="text-green-700 font-bold">$14.99</span><span className="text-sm text-gray-500">/o dată</span></>,
    features: [
      '1 anunț (vizibilitate 30 zile)',
      'Contact direct cu aplicanții',
      'Statistici de bază - vizualizări per anunț'
    ],
    priceId: 'price_1O8tq8vo26lc0v3ocmjctl8gact4gnfk1_single',
    isAddon: true
  },
  {
    key: 'promotion',
    title: 'Promovare',
    price: <><span className="line-through text-gray-400 mr-2">$20</span><span className="text-green-700 font-bold">$9.99</span><span className="text-sm text-gray-500">/anunț</span></>,
    features: [
      'Card special și printre primele joburi',
      'Postare în 48h pe paginile de social media: Facebook, TikTok, Instagram',

    ],
    priceId: 'price_1O8tq8vo26lc0v3ocmjctl8gact4gnfk1_promotion',
    isAddon: true
  }
];

function PlanCard({ title, price, features, selected, onSelect, disabled, isActivePlan, isAddon, onAddonService, planKey }: any) {
  return (
    <div onClick={onSelect} className={`border rounded-lg p-6 shadow-sm transition-all duration-200 ${isActivePlan
      ? 'border-green-600 ring-2 ring-green-300 bg-green-50 transform scale-105'
      : selected
        ? 'border-purple-600 ring-2 ring-purple-300 bg-purple-50 transform scale-102'
        : 'border-gray-200 hover:border-gray-300'
      } ${disabled ? 'opacity-60' : 'hover:shadow-lg'} bg-white flex flex-col h-full relative`}>

      {isActivePlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            ACTIV
          </span>
        </div>
      )}

      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-2xl font-semibold mb-4">{price}</div>
      <ul className="mb-6 flex-1 space-y-2">
        {features.map((f: string) => (
          <li key={f} className="text-gray-700 text-sm flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {isActivePlan && !disabled && (
        <div className="mt-2 text-xs text-green-700 font-semibold text-center bg-green-100 py-1 px-2 rounded">
          Planul tău actual
        </div>
      )}

      {!isActivePlan && onSelect && !disabled && !isAddon && (
        <button
          className={`w-full py-2 rounded font-semibold transition-colors ${selected
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
          onClick={onSelect}
        >
          Alege
        </button>
      )}

      {isAddon && (
        <div className="text-xs text-gray-500 text-center py-1 px-2 rounded bg-gray-100">
          Serviciu adițional
        </div>
      )}

      {disabled && <div className="text-xs text-gray-400 text-center">Activ automat la înregistrare</div>}
    </div>
  );
}

export default function EmployerHome() {
  const navigate = useNavigate();
  const { employer } = useAuthStore();
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    trialActive: boolean;
    subscriptionActive: boolean;
    trialEnd?: string;
  }>({ trialActive: false, subscriptionActive: false });
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'single' | 'promotion'>('basic');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (employer) {
      const now = new Date();
      const trialEnd = employer.trialEnd ? new Date(employer.trialEnd) : null;
      const subscriptionEnd = employer.subscriptionEnd ? new Date(employer.subscriptionEnd) : null;

      const trialActive = trialEnd ? now < trialEnd : false;
      const subscriptionActive = !!(employer.subscriptionActive &&
        (subscriptionEnd ? now < subscriptionEnd : true)); // Pentru abonamente lunare, nu are subscriptionEnd

      setSubscriptionStatus({
        trialActive,
        subscriptionActive,
        trialEnd: employer.trialEnd,
      });

      // Dacă profilul companiei nu e completat, arată pop-up-ul
      if (employer && !employer.hasProfileCompleted) {
        setShowProfileModal(true);
      }
    }
  }, [employer]);

  // Determin planul activ
  const activePlanKey = subscriptionStatus.subscriptionActive
    ? (PLAN_OPTIONS.find(p => p.key !== 'trial' && employer?.subscriptionType === p.key)?.key || 'basic')
    : subscriptionStatus.trialActive
      ? 'trial'
      : null;

  const handleSubscribe = async (priceIdOverride?: string) => {
    try {
      const plan = PLAN_OPTIONS.find(p => p.priceId === priceIdOverride) || PLAN_OPTIONS.find(p => p.key === selectedPlan);
      if (!plan?.priceId) {
        console.error('Plan not found:', { priceIdOverride, selectedPlan });
        return;
      }
      const { url } = await employerAPI.createStripeCheckoutSession(plan.priceId);
      window.location.href = url;
    } catch (err) {
      console.error('Subscription error:', err);
      alert('Eroare la inițierea plății Stripe. Încearcă din nou.');
    }
  };

  const handleAddonService = async (planKey: string) => {
    try {
      const plan = PLAN_OPTIONS.find(p => p.key === planKey);
      if (!plan?.priceId) {
        console.error('Addon service not found:', planKey);
        return;
      }
      const { url } = await employerAPI.createStripeCheckoutSession(plan.priceId);
      window.location.href = url;
    } catch (err) {
      console.error('Addon service error:', err);
      alert('Eroare la inițierea plății pentru serviciul adițional. Încearcă din nou.');
    }
  };

  const handleCompleteProfile = () => {
    setShowProfileModal(false);
    navigate("/employer/profile");
  };

  const handleSkipProfile = () => {
    setShowProfileModal(false);
    // Navigate to home page without completing profile
  };

  const canUsePremium = subscriptionStatus.trialActive || subscriptionStatus.subscriptionActive;

  // Pop-up pentru profilul companiei
  if (showProfileModal) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Completează profilul companiei
            </h1>
            <p className="text-gray-700 mb-6">
              Pentru a posta joburi și a primi aplicații relevante, completează informațiile despre compania ta.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleCompleteProfile}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Completează profilul
              </button>
              <button
                onClick={handleSkipProfile}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Mai târziu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Status trial/abonament */}
        {employer && (
          <div className="mb-6">
            {subscriptionStatus.subscriptionActive ? (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded mb-4">
                Abonament activ: <b>{PLAN_OPTIONS.find(p => p.key === employer?.subscriptionType)?.title || 'Basic'}</b>. Poți schimbă planul oricând mai jos.
              </div>
            ) : subscriptionStatus.trialActive ? (
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded mb-4">
                Trial activ până la: <b>{subscriptionStatus.trialEnd ? new Date(subscriptionStatus.trialEnd).toLocaleString() : ''}</b>
              </div>
            ) : (
              <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-800 p-4 rounded mb-4">
                <b>Trial-ul tău a expirat!</b> Alege un plan de abonament pentru a continua să folosești platforma.
              </div>
            )}
          </div>
        )}

        {employer && employer.hasProfileCompleted === false && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded flex items-center justify-between">
            <div>
              <b>Profilul companiei nu este completat!</b> Completează profilul pentru a putea posta joburi și a primi aplicații relevante.
            </div>
            <button
              onClick={() => navigate("/employer/profile")}
              className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
            >
              Completează profilul
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bun venit, {employer?.companyName}!
          </h1>
          <p className="text-gray-600 mb-6">
            Aceasta este pagina ta principală ca angajator.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/employer/profile")}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
            >
              <h3 className="font-semibold text-blue-900">Profil companie</h3>
              <p className="text-sm text-blue-700">Gestionează informațiile companiei</p>
            </button>

            <button
              onClick={() => (employer?.hasProfileCompleted === false) ? null : navigate("/employer/post-job")}
              className={`p-4 bg-green-50 rounded-lg border border-green-200 transition ${(employer?.hasProfileCompleted === false) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-100'}`}
              disabled={(employer?.hasProfileCompleted === false)}
              title={
                employer?.hasProfileCompleted === false
                  ? 'Completează profilul companiei pentru a posta joburi'
                  : ''
              }
            >
              <h3 className="font-semibold text-green-900">Postează job</h3>
              <p className="text-sm text-green-700">Creează un anunț nou</p>
            </button>

            <button
              onClick={() => (employer?.hasProfileCompleted === false) || !canUsePremium ? null : navigate("/employer/employees")}
              className={`p-4 bg-purple-50 rounded-lg border border-purple-200 transition ${(employer?.hasProfileCompleted === false) || !canUsePremium ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-100'}`}
              disabled={(employer?.hasProfileCompleted === false) || !canUsePremium}
              title={
                employer?.hasProfileCompleted === false
                  ? 'Completează profilul companiei pentru a vedea candidații'
                  : !canUsePremium
                    ? 'Activează un abonament pentru a vedea candidații'
                    : ''
              }
            >
              <h3 className="font-semibold text-purple-900">Candidații</h3>
              <p className="text-sm text-purple-700">Vezi aplicațiile primite</p>
            </button>
          </div>

        </div>


        {/* Oferte de abonament - sub mesajul de bun venit */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Planuri de abonament</h2>
              <p className="text-gray-600">Alege planul care se potrivește cel mai bine nevoilor tale</p>
            </div>

            {/* Planuri principale */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {PLAN_OPTIONS.filter(plan => !plan.isAddon).map(plan => (
                <PlanCard
                  key={plan.key}
                  title={plan.title}
                  price={plan.price}
                  features={plan.features}
                  selected={selectedPlan === plan.key}
                  onSelect={plan.disabled || activePlanKey === plan.key ? undefined : () => setSelectedPlan(plan.key as 'basic' | 'premium' | 'single' | 'promotion')}
                  disabled={plan.disabled}
                  isActivePlan={activePlanKey === plan.key && !plan.disabled}
                  isAddon={plan.isAddon}
                  onAddonService={handleAddonService}
                  planKey={plan.key}
                />
              ))}
            </div>

            {/* Servicii adiționale */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Servicii adiționale</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {PLAN_OPTIONS.filter(plan => plan.isAddon).map(plan => (
                  <PlanCard
                    key={plan.key}
                    title={plan.title}
                    price={plan.price}
                    features={plan.features}
                    selected={false}
                    onSelect={undefined}
                    disabled={false}
                    isActivePlan={false}
                    isAddon={plan.isAddon}
                    onAddonService={undefined}
                    planKey={plan.key}
                  />
                ))}
              </div>
            </div>

            {activePlanKey !== 'trial' && (
              <div className="flex justify-center">
                <button
                  onClick={() => handleSubscribe(PLAN_OPTIONS.find(p => p.key === selectedPlan)?.priceId)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg text-lg"
                >
                  Abonează-te la {PLAN_OPTIONS.find(p => p.key === selectedPlan)?.title}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
