import React from 'react'
import { Dialog } from '@headlessui/react'
import { useRef, useState } from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { useAuth } from '~/lib/firebase'
import { FcGoogle } from 'react-icons/fc'

function PageLogin() {
  const auth = useAuth()

  const handleGoogleLoginClick = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
  }

  return (
    <div className="flex justify-center overflow-y-auto bg-gray-50">
      <section className="[min-width:640px] dark:bg-gray-900">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <a
            href="#"
            className="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-white">
            <div className="flex justify-center">
              <img src="/images/flair-logo.svg" width={180} height={48} className="mb-2" />
            </div>
          </a>
          <div className="sm:max-w-md w-full rounded-lg bg-white shadow md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div>
                  <button className="relative my-1 w-full rounded-md border bg-gray-100 py-2 text-sm text-gray-800 hover:bg-gray-200">
                    <span>Login with Email</span>
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet?{' '}
                    <a
                      href="#"
                      className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
                      Sign up
                    </a>
                  </p>
                </div>
              </form>
              <div>
                <div className=" mt-5 text-center text-sm font-bold text-gray-400">
                  Other methods
                </div>
                <button
                  onClick={handleGoogleLoginClick}
                  className="relative mt-1 flex w-full items-center justify-center rounded-md border bg-gray-100 py-2 text-sm text-gray-800 hover:bg-gray-200">
                  <div className="inline-flex items-center">
                    <FcGoogle className="mr-2" size={20} />
                    <span>Login with Google</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  // return (
  //   <div className="flex min-h-screen flex-col items-center justify-center bg-gray-300">
  //     <div className="flex w-96 flex-col rounded-md bg-white px-4 py-8 shadow-md sm:px-6 md:px-8 lg:px-10">
  // <div className="flex justify-center">
  //   <img src="images/flair-logo.svg" width={120} height={32} className="" />
  // </div>
  //       <button
  //         onClick={handleGoogleLoginClick}
  //         className="relative mt-6 rounded-md border bg-gray-100 py-2 text-sm text-gray-800 hover:bg-gray-200">
  //         <span>Login with Google</span>
  //       </button>
  //     </div>
  //   </div>
  // )
}

export default PageLogin
