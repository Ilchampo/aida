import React from 'react';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleProps {
    title: string;
    open: boolean;
    onToggle: VoidFunction;
    children: React.ReactNode;
}
const Collapsible: React.FC<CollapsibleProps> = (props) => {
    const { title, open, onToggle, children } = props;

    return (
        <div className="rounded-lg border border-indigo-500/20 bg-void-900 overflow-hidden">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between p-4 text-left transition hover:bg-indigo-500/5"
            >
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-slate-100">
                    {title}
                </h2>
                {open ? (
                    <ChevronUpIcon className="h-5 w-5 text-cyan-400" />
                ) : (
                    <ChevronDownIcon className="h-5 w-5 text-cyan-400" />
                )}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Collapsible;
