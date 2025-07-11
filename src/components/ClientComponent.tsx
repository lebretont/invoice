import { useEffect, useState, type PropsWithChildren } from "react";

export function ClientComponent({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <div>Chargement du PDF...</div>
      </div>
    );
  }

  return <div style={{ width: '100%', height: '100%' }}>{children}</div>;
}