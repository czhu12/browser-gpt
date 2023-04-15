import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

function Checkmark() {
  return (
    <svg className="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="11" />
      <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
    </svg>
  );
}
export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <img src="/beams.jpg" alt="" className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2" width="1308" />
      <div className="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="mx-auto max-w-md">
          <img height="500" src="/logo.png" className="mx-auto h-20" alt="Logo" />
          <div className="divide-y divide-gray-300/50">
            <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
              <p className="text-2xl text-gray-900 tracking-tight font-bold">ChatGPT, directly in your browser.</p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Checkmark />
                  <p className="ml-4">
                    Access ChatGPT without changing tabs
                  </p>
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  <p className="ml-4">
                    Let ChatGPT read and summarize what you&apos;re reading
                  </p>
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  <p className="ml-4">
                    Automatically compose emails, blog posts, and more
                  </p>
                </li>
                <li className="flex items-center">
                  <Checkmark />
                  <p className="ml-4">
                    Use your own OpenAI API keys
                  </p>
                </li>
              </ul>
            </div>
            <div className="pt-8 text-base font-semibold leading-7">
              <p>
                <button className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500">
                  <img src="/chrome.png" className="h-5 pr-2" /> Add to Chrome
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
