'use client';

import React, { useState } from 'react';

interface BecomePartnerFormProps {
  locale: 'es' | 'en';
}

export default function BecomePartnerForm({ locale }: BecomePartnerFormProps) {
  const [formData, setFormData] = useState({
    storeName: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const isEs = locale === 'es';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate submission delay
    setTimeout(() => {
      setStatus('success');
      setFormData({
        storeName: '',
        contactName: '',
        email: '',
        phone: '',
        city: '',
        message: '',
      });
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
        <div className="h-16 w-16 rounded-full bg-[#22ef00]/10 border border-[#22ef00] flex items-center justify-center text-[#22ef00] animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white uppercase font-opensauce">
          {isEs ? '¡Solicitud Recibida!' : 'Application Received!'}
        </h3>
        <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
          {isEs
            ? 'Gracias por tu interés en GOSU®. Nuestro equipo de mayoristas revisará tu solicitud y se pondrá en contacto contigo en las próximas 24-48 horas.'
            : 'Thank you for your interest in GOSU®. Our wholesale team will review your application and get in touch with you within 24-48 hours.'}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs text-[#00e8ff] hover:underline uppercase tracking-wider font-semibold pt-4"
        >
          {isEs ? 'Enviar otra solicitud' : 'Submit another application'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="space-y-1">
        <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
          {isEs ? 'Nombre de la Tienda' : 'Store Name'} *
        </label>
        <input
          type="text"
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#ff5c00] transition-colors"
          placeholder={isEs ? 'Ej. Mi Tienda TCG' : 'e.g. My TCG Shop'}
        />
      </div>

      <div className="space-y-1">
        <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
          {isEs ? 'Nombre de Contacto' : 'Contact Person'} *
        </label>
        <input
          type="text"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#ff5c00] transition-colors"
          placeholder={isEs ? 'Ej. Juan Pérez' : 'e.g. John Doe'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#ff5c00] transition-colors"
            placeholder="juan@mitienda.com"
          />
        </div>
        <div className="space-y-1">
          <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
            {isEs ? 'Teléfono' : 'Phone'} *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#ff5c00] transition-colors"
            placeholder="+51 987654321"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
          {isEs ? 'Ciudad y Región' : 'City & Region'} *
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#ff5c00] transition-colors"
          placeholder="Ej. Lima, Perú"
        />
      </div>

      <div className="space-y-1">
        <label className="text-zinc-400 font-semibold uppercase tracking-wider block">
          {isEs ? 'Mensaje o Comentarios' : 'Message or Comments'}
        </label>
        <textarea
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 text-white p-3 focus:outline-none focus:border-[#ff5c00] transition-colors resize-none"
          placeholder={isEs ? 'Cuéntanos sobre tu tienda y qué productos te interesan.' : 'Tell us about your shop and which products you are interested in.'}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full mt-4 rounded-full bg-white text-black font-semibold py-3.5 px-6 transition-all hover:bg-[#ff5c00] hover:text-white hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transform hover:scale-[1.01] uppercase tracking-wider"
      >
        {status === 'submitting'
          ? (isEs ? 'Enviando...' : 'Sending...')
          : (isEs ? 'Enviar Solicitud' : 'Submit Application')}
      </button>
    </form>
  );
}
