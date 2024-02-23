import { ReactNode } from 'react';

export type Provider = (children: ReactNode) => ReactNode;

type ProvidersProps = {
  children: ReactNode;
  providers: Provider[];
};

export default function Providers({ children, providers }: ProvidersProps) {
  return providers.reverse().reduce((acc, current) => {
    return current(acc);
  }, children);
}
