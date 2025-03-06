import React from "react";
import { Link } from "react-router-dom";
import { FiEdit3, FiUsers, FiLock, FiClock, FiGrid, FiGlobe, FiDownload } from "react-icons/fi";

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                CollabDraw
              </h1>
              <p className="mt-6 text-xl text-indigo-100">
                A powerful collaborative whiteboard workspace that helps teams visualize ideas, brainstorm, and create together in real-time.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    src="/api/placeholder/600/400"
                    alt="Collaboration drawing board example"
                    className="w-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-indigo-500 text-5xl opacity-75">
                      <FiEdit3 />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to collaborate visually
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              CollabDraw brings together drawing tools, real-time collaboration, and team organization in one seamless experience.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-20 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                Powerful drawing tools
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Create beautiful diagrams, sketches, and illustrations with our easy-to-use yet powerful drawing toolkit.
              </p>

              <dl className="mt-10 space-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <FiEdit3 className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Intuitive drawing experience</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Our drawing tools are designed to feel natural and responsive, with support for both mouse and touch input.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <FiGrid className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Templates and shapes library</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Start quickly with pre-made templates or use our extensive library of shapes and icons.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0">
              <img
                className="relative mx-auto rounded-lg shadow-lg"
                src="/api/placeholder/500/400"
                alt="Drawing tools interface"
              />
            </div>
          </div>

          <div className="relative mt-12 sm:mt-16 lg:mt-24">
            <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="lg:col-start-2">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                  Real-time collaboration
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Work together with your team in real-time, no matter where they are located.
                </p>

                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <FiUsers className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Multi-user editing</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      See changes instantly as team members contribute to drawings simultaneously.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <FiClock className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Version history</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Track changes over time and revert to previous versions when needed.
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
                <img
                  className="relative mx-auto rounded-lg shadow-lg"
                  src="/api/placeholder/500/400"
                  alt="Collaboration interface"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">All the features you need</h2>
            <p className="mt-4 text-lg text-gray-500">
              CollabDraw is packed with everything you need for effective visual collaboration.
            </p>
          </div>
          <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            <div className="relative">
              <dt>
                <FiLock className="absolute h-6 w-6 text-green-500" />
                <p className="ml-9 text-lg leading-6 font-medium text-gray-900">Secure sharing</p>
              </dt>
              <dd className="mt-2 ml-9 text-base text-gray-500">
                Control access to your drawings with customizable permissions.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <FiGlobe className="absolute h-6 w-6 text-green-500" />
                <p className="ml-9 text-lg leading-6 font-medium text-gray-900">Cloud-based</p>
              </dt>
              <dd className="mt-2 ml-9 text-base text-gray-500">
                Access your drawings from anywhere, on any device.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <FiDownload className="absolute h-6 w-6 text-green-500" />
                <p className="ml-9 text-lg leading-6 font-medium text-gray-900">Export options</p>
              </dt>
              <dd className="mt-2 ml-9 text-base text-gray-500">
                Export your drawings in multiple formats for presentations and documents.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <FiUsers className="absolute h-6 w-6 text-green-500" />
                <p className="ml-9 text-lg leading-6 font-medium text-gray-900">Team management</p>
              </dt>
              <dd className="mt-2 ml-9 text-base text-gray-500">
                Organize drawings by teams and projects for better workflow.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Sign up for free today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of teams that are already using CollabDraw to bring their ideas to life.
          </p>
          <Link
            to="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <h2 className="text-2xl font-bold text-white">CollabDraw</h2>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-400 md:text-left">
                &copy; {new Date().getFullYear()} CollabDraw. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;