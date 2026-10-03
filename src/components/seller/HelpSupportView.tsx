import React, { useState } from 'react';
import type { SupportTicket } from '../../types/seller';
import { toast } from 'react-toastify';

export const HelpSupportView: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Payouts & MoMo');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittedTickets, setSubmittedTickets] = useState<SupportTicket[]>([]);

  const faqs = [
    {
      q: 'How do seller payouts work in Rwanda on e-Curuza?',
      a: 'All seller payouts are processed automatically every Tuesday. Funds from completed orders are deposited directly to your verified MTN Mobile Money or Airtel Money phone number, or your commercial bank account with 0% withdrawal fees.',
    },
    {
      q: 'How do I add product variants (sizes, colors, stock)?',
      a: 'Navigate to the Products tab and click "Add Product". You can define individual prices, SKUs, and inventory thresholds for each variant, which will update the store in real time.',
    },
    {
      q: 'What are the delivery and shipping guidelines across Rwanda?',
      a: 'For orders within Kigali city limits, e-Curuza Express riders dispatch same-day or within 24 hours. For upcountry deliveries (Musanze, Huye, Rubavu, Rwamagana), packages are delivered within 48 to 72 hours via regional couriers.',
    },
    {
      q: 'What is the fee or commission structure for merchants?',
      a: 'e-Curuza provides standard merchant accounts with 0% platform listing fees. A small transaction processing fee applies only upon successful order delivery.',
    },
    {
      q: 'How do I handle returns and buyer refunds?',
      a: 'Buyers can request a return within 7 days of delivery for damaged or misdescribed items. Once the return is inspected and approved in your Orders tab, a refund is processed through the platform automatically.',
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.warning('Please complete the subject and message fields.');
      return;
    }

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      status: 'Open',
      createdAt: 'Just now',
      message: ticketMessage.trim(),
    };

    setSubmittedTickets((prev) => [newTicket, ...prev]);
    toast.success('Your support ticket has been submitted to the merchant help desk!');
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
          Help & Merchant Support
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Access merchant guides, frequently asked questions, or open a support ticket
        </p>
      </div>

      {/* Support Channels Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#0e5c2d] flex items-center justify-center font-bold mb-3">
              📞
            </div>
            <h4 className="text-sm font-bold text-gray-900">Merchant Hotline</h4>
            <p className="text-xs text-gray-500 mt-1">Direct priority line for Rwandan sellers</p>
          </div>
          <span className="text-xs font-bold text-[#0e5c2d] mt-3 block">+250 788 123 456</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold mb-3">
              💬
            </div>
            <h4 className="text-sm font-bold text-gray-900">WhatsApp Help</h4>
            <p className="text-xs text-gray-500 mt-1">Chat directly with account representative</p>
          </div>
          <span className="text-xs font-bold text-green-700 mt-3 block">+250 788 998 877</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
              ✉️
            </div>
            <h4 className="text-sm font-bold text-gray-900">Email Desk</h4>
            <p className="text-xs text-gray-500 mt-1">Average response within 2 hours</p>
          </div>
          <span className="text-xs font-bold text-blue-700 mt-3 block">support@ecuruza.rw</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-300/80 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center font-bold mb-3">
              ⚡
            </div>
            <h4 className="text-sm font-bold text-gray-900">System Status</h4>
            <p className="text-xs text-gray-500 mt-1">Payments, webhooks, and rider networks</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Operational 100%
          </span>
        </div>
      </div>

      {/* Grid: FAQs (Left) and Ticket Submission Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FAQs Accordion (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm space-y-3">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-black">Frequently Asked Questions</h3>
            <p className="text-xs text-gray-500 mt-0.5">Quick answers to common merchant questions</p>
          </div>

          <div className="space-y-2 pt-1">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-3.5 flex items-center justify-between gap-3 bg-gray-50/70 hover:bg-gray-100/70 transition-colors"
                  >
                    <span className="text-xs md:text-sm font-bold text-gray-900">{faq.q}</span>
                    <span className="text-gray-500 font-bold">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-3.5 bg-white text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Ticket Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm">
          <div className="border-b border-gray-100 pb-3 mb-4">
            <h3 className="text-base font-bold text-black">Open a Support Ticket</h3>
            <p className="text-xs text-gray-500 mt-0.5">Our support team will respond directly</p>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Inquiring about payout delay"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                >
                  <option value="Payouts & MoMo">Payouts & MoMo</option>
                  <option value="Orders & Shipping">Orders & Shipping</option>
                  <option value="Product Catalog">Product Catalog</option>
                  <option value="Account & Security">Account & Security</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Message Description *</label>
              <textarea
                required
                rows={3}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Provide details about your query or incident..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#324035] py-2.5 text-xs md:text-sm font-bold text-white hover:bg-[#222529] transition-all shadow-sm active:scale-98"
            >
              Submit Ticket
            </button>
          </form>

          {/* Submitted tickets preview */}
          {submittedTickets.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-800 block mb-2">Recent Tickets</span>
              <div className="space-y-2">
                {submittedTickets.map((tck) => (
                  <div key={tck.id} className="p-2.5 rounded-lg bg-gray-50 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-900 block">{tck.subject}</span>
                      <span className="text-[10px] text-gray-400">{tck.id} · {tck.createdAt}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {tck.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
