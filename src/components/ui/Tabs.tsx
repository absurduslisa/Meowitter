'use client';
import { useState} from 'react';
import { pageLayout } from '@/styles/global';

type Tab = {
  label:       string;
  content:     React.ReactNode;
};

type Props = {
  tabs: Tab[];
}

export default function Tabs({tabs}: Props) {
    const [active, setActive] = useState(0);

    return (
        <div className={`${pageLayout.inputSections}`}>

            <ul className="card flex w-full flex-row gap-1.5 bg-pink-light border-brown p-2 mb-4">
                {tabs.map((tab, index) => (
                    <li key={tab.label} className={`tab relative transition-colors ${
                                active === index
                                    ? 'activeTab bg-pink border-brown'
                                    : 'defaultTab'
                            }`}>
                        <button
                        className='btn after:absolute after:inset-0'
                            onClick={() => setActive(index)}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
            <div className='w-full bg-yellow'>
                {tabs[active].content}
            </div>
        </div>
    );
}