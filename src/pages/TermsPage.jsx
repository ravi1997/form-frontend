// src/pages/TermsPage.jsx
import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import DashboardLayout from '../components/DashboardLayout';
import { useScrollSpy } from '../hooks/useScrollSpy';

const rawSections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing this website or using our services, you agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations.`
  },
  {
    id: 'responsibilities',
    title: '2. User Responsibilities',
    content: (
      <ul className="list-disc ml-6 space-y-1">
        <li>Provide accurate and complete information when requested.</li>
        <li>Maintain the confidentiality of your login credentials.</li>
        <li>Use the system responsibly and legally.</li>
      </ul>
    )
  },
  {
    id: 'privacy',
    title: '3. Privacy',
    content: `We respect your privacy. All personal information is handled according to our Privacy Policy.`
  },
  {
    id: 'intellectual',
    title: '4. Intellectual Property',
    content: `All content and services provided are the property of the organization or its licensors, and are protected under applicable copyright and intellectual property laws.`
  },
  {
    id: 'termination',
    title: '5. Termination',
    content: `We reserve the right to suspend or terminate access to our services if a user violates these terms or engages in malicious or unauthorized behavior.`
  },
  {
    id: 'changes',
    title: '6. Changes to Terms',
    content: `These Terms may be updated from time to time. Users will be notified of significant changes via the app or email.`
  },
  {
    id: 'contact',
    title: '7. Contact',
    content: (
      <p>
        For questions or concerns, email{' '}
        <a href="mailto:support@example.com" className="text-blue-600 dark:text-blue-400 underline">
          support@example.com
        </a>.
      </p>
    )
  }
];

const sidebarTiles = [
  { title: 'Back to Home', icon: '🏠', path: '/' },
  { title: 'Terms & Conditions', icon: '📜', path: '/terms' }
];

const TermsPage = () => {
  const [openSections, setOpenSections] = useState({});
  const activeId = useScrollSpy(rawSections.map((s) => s.id), 140);

  useEffect(() => {
    if (activeId) {
      setOpenSections((prev) => ({ ...prev, [activeId]: true }));
    }
  }, [activeId]);

  return (
    <DashboardLayout tiles={sidebarTiles}>
      <div className="space-y-8">
        {/* Title */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            📜 Terms & Conditions
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            By accessing or using this platform, you agree to the following terms:
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">📌 Table of Contents</h2>
          <ul className="list-disc ml-6 space-y-1">
            {rawSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`transition-colors hover:underline ${
                    activeId === section.id
                      ? 'text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclosure Sections */}
        <div className="space-y-4">
          {rawSections.map((section) => (
            <Disclosure key={section.id} defaultOpen={!!openSections[section.id]} as="div" className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="flex justify-between w-full px-5 py-4 text-left text-lg font-medium text-slate-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                    id={section.id}
                  >
                    {section.title}
                    <ChevronUpIcon
                      className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-5 pb-4 pt-0 text-slate-700 dark:text-gray-300">
                    {section.content}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-10">
          Last updated: July 2025
        </p>
      </div>
    </DashboardLayout>
  );
};

export default TermsPage;
