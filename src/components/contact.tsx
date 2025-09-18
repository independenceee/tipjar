"use client";

import Action from "./action";

export default function Contact() {
    return (
        <section id="contact" className="relative flex min-h-screen items-center overflow-hidden">
            <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
                <div className="relative">
                    <div className="text-center mb-8">
                        <div className="mb-4 flex items-center justify-center gap-4">
                            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">Join Our Team</h2>
                            <div className="h-1 w-12 bg-gradient-to-r from-transparent to-blue-500"></div>
                        </div>
                        <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300">
                            Ready to contribute to the Cardano ecosystem? We're always looking for passionate individuals who want to make a
                            difference in the blockchain space.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <form className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="your-name"
                                            placeholder="Enter your full name"
                                            onKeyPress={(e) => {
                                                const allowedChars = /[a-zA-ZÀ-ỹ\s'-]/;
                                                if (!allowedChars.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className={`w-full px-3 py-2 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                                                false
                                                    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                                                    : "border-gray-300 dark:border-gray-600"
                                            }`}
                                        />
                                        {false && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {false}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="your-number"
                                            placeholder="+84 123 456 789"
                                            onKeyPress={(e) => {
                                                const allowedChars = /[0-9+\-()\s]/;
                                                if (!allowedChars.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="your-email"
                                            placeholder="your.email@example.com"
                                            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                        />
                                    </div>

                                    <input type="hidden" name="event-location" />
                                </div>

                                {false && (
                                    <div>
                                        <p className="text-red-500 text-xs flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {false}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us about your inquiry..."
                                        rows={3}
                                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success text-lg bg-blue-600 dark:bg-white px-6 py-3 font-semibold text-white dark:text-blue-900 shadow-lg hover:bg-blue-700 dark:hover:bg-gray-100 w-full"
                                >
                                    {false ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-blue-900"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Sending...
                                        </div>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Action title="Back To Home" href="#home" />
        </section>
    );
}
