import dynamic from 'next/dynamic';

const UploadForm = dynamic(() => import('./UploadForm'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main>
      <h1>Tenant Survey Portal</h1>
      <UploadForm />
    </main>
  );
}

