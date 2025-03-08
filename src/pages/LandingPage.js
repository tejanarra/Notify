import React from "react";
import { Link } from "react-router-dom";
import {
  FiEdit3,
  FiUsers,
  FiLock,
  FiClock,
  FiGrid,
  FiGlobe,
  FiDownload,
  FiArrowRight,
} from "react-icons/fi";

const LandingPage = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-500/20 text-pink-400 border border-pink-500/30 mb-5">
                Collaborative workspaces reimagined
              </span>
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600">
                  Notify
                </span>
              </h1>
              <p className="mt-5 text-xl leading-relaxed text-gray-300">
                A powerful collaborative whiteboard workspace that helps teams
                visualize ideas, brainstorm, and create together in real-time
                with a stunning neon interface.
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 md:py-3 md:text-lg md:px-10 shadow-lg shadow-pink-500/40 transition-all duration-200 hover:shadow-xl hover:shadow-pink-500/50"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-pink-500/30 text-base font-medium rounded-full text-pink-400 hover:bg-pink-500/10 md:py-3 md:text-lg md:px-10 transition-all duration-200"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center justify-center">
              <div className="relative mx-auto w-full rounded-2xl shadow-2xl overflow-hidden lg:max-w-md">
                <div className="relative block w-full rounded-2xl overflow-hidden transform transition-all hover:scale-105 duration-300 shadow-xl shadow-pink-500/20">
                  <a
                    href="https://storyset.com/web"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/landing-page-images/Shared workspace-amico.svg"
                      alt="Collaboration drawing board example"
                      className=" w-full"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            className="text-gray-900 fill-current"
          >
            <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
          </svg>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-24 bg-gray-900 overflow-hidden lg:py-32">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              A{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600">
                better way
              </span>{" "}
              to collaborate visually
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-300">
              Notify brings together drawing tools, real-time collaboration, and
              team organization in one seamless experience.
            </p>
          </div>

          <div className="relative mt-16 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                Powerful drawing tools
              </h3>
              <p className="mt-3 text-lg text-gray-300">
                Create beautiful diagrams, sketches, and illustrations with our
                easy-to-use yet powerful drawing toolkit.
              </p>

              <dl className="mt-10 space-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/30">
                      <FiEdit3 className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-white">
                      Intuitive drawing experience
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-400">
                    Our drawing tools are designed to feel natural and
                    responsive, with support for both mouse and touch input.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/30">
                      <FiGrid className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-white">
                      Templates and shapes library
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-400">
                    Start quickly with pre-made templates or use our extensive
                    library of shapes and icons.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0">
              <a
                href="https://storyset.com/web"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className=" relative mx-auto rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105"
                  src="/images/landing-page-images/Create-amico.svg"
                  alt="Drawing tools interface"
                />
              </a>
            </div>
          </div>

          <div className="relative mt-20 sm:mt-24 lg:mt-32">
            <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div className="lg:col-start-2">
                <h3 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                  Real-time collaboration
                </h3>
                <p className="mt-3 text-lg text-gray-300">
                  Work together with your team in real-time, no matter where
                  they are located.
                </p>

                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/30">
                        <FiUsers className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-white">
                        Multi-user editing
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-400">
                      See changes instantly as team members contribute to
                      drawings simultaneously.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/30">
                        <FiClock className="h-6 w-6" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-white">
                        Version history
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-400">
                      Track changes over time and revert to previous versions
                      when needed.
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
                <a
                  href="https://storyset.com/web"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="relative mx-auto rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 "
                    src="/images/landing-page-images/Live collaboration-cuate.svg"
                    alt="Collaboration interface"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:py-32 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white">
              All the features you need
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Notify brings together everything you need for effective visual
              collaboration.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature Card 1 */}
            <div className="relative bg-gray-900 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-pink-500/20 hover:border-pink-500/40 group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-fuchsia-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <dt className="flex items-center relative z-10">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-lg shadow-pink-500/30">
                    <FiLock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="ml-4 text-lg font-medium text-white">
                  Secure sharing
                </p>
              </dt>
              <dd className="mt-3 text-base text-gray-400 relative z-10">
                Control access to your drawings with customizable permissions.
              </dd>
            </div>

            {/* Feature Card 2 */}
            <div className="relative bg-gray-900 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-pink-500/20 hover:border-pink-500/40 group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-fuchsia-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <dt className="flex items-center relative z-10">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-lg shadow-pink-500/30">
                    <FiGlobe className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="ml-4 text-lg font-medium text-white">
                  Cloud-based
                </p>
              </dt>
              <dd className="mt-3 text-base text-gray-400 relative z-10">
                Access your drawings from anywhere, on any device.
              </dd>
            </div>

            {/* Feature Card 3 */}
            <div className="relative bg-gray-900 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-pink-500/20 hover:border-pink-500/40 group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-fuchsia-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <dt className="flex items-center relative z-10">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-lg shadow-pink-500/30">
                    <FiDownload className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="ml-4 text-lg font-medium text-white">
                  Export options
                </p>
              </dt>
              <dd className="mt-3 text-base text-gray-400 relative z-10">
                Export your drawings in multiple formats for presentations and
                documents.
              </dd>
            </div>

            {/* Feature Card 4 */}
            <div className="relative bg-gray-900 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-pink-500/20 hover:border-pink-500/40 group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-fuchsia-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <dt className="flex items-center relative z-10">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-lg shadow-pink-500/30">
                    <FiUsers className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="ml-4 text-lg font-medium text-white">
                  Team management
                </p>
              </dt>
              <dd className="mt-3 text-base text-gray-400 relative z-10">
                Organize drawings by teams and projects for better workflow.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section with Logo */}
      <div className="bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(236,72,153,0.2),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(192,38,211,0.2),transparent_50%)]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center py-20 px-4 sm:py-28 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600 inline-block">
              Notify
            </h2>
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-2">
            <span className="block">Ready to get started?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join teams that are already using Notify to bring their ideas to
            life.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 transition-all duration-200 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40"
          >
            Sign up for free
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
        {/* Footer */}
        <footer className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600">
                Notify
              </h2>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-400 md:text-left">
                &copy; {new Date().getFullYear()} Notify. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
