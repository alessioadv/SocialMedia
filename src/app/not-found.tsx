import Link from "next/link";

async function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background text-center'>
      <h2 className='text-4xl font-bold text-red-500'>404 - Not Found</h2>
      <p className='mt-4 text-lg text-gray-700'>
        We couldn't find the page you're looking for.
      </p>
      <div className='mt-6'>
        <Link href={"/"}>Return to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
