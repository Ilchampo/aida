import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
}

const TextField: React.FC<TextFieldProps> = (props) => {
    const { label, id, className = '', ...inputProps } = props;

    return (
        <div className="space-y-1.5">
            <label
                htmlFor={id}
                className="block font-mono text-[11px] font-medium uppercase tracking-widest text-cyan-400/80"
            >
                {label}
            </label>
            <input
                id={id}
                className={`w-full rounded-md border border-slate-700 bg-void-950/60 px-3 py-2.5 font-mono text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...inputProps}
            />
        </div>
    );
};

export default TextField;
