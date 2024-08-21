import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
// import { loginAction, logoutAction } from '../store/userSlice';
// import jaxios from '../util/jwtUtil';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { setCookie, getCookie, removeCookie } from "../util/cookieUtil";
import '../../style/main.css'
import Footer from '../headerfooter/Footer';
import Heading from '../headerfooter/Heading';

function TestContents() {
    return (
        <>
            <Heading />
            <div className="flex min-h-[100dvh] flex-col">
                <section className="w-full bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] py-20 md:py-32">
                    <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 md:flex-row md:gap-12">
                        <div className="max-w-xl space-y-4 text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
                                Welcome to the Trip Community
                            </h1>
                            <p className="text-lg text-white md:text-xl">
                                Connect with fellow travelers, share your experiences, and plan your next adventure.
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                                    Join Now
                                </button>
                            </div>
                        </div>
                        <img
                            src="https://via.placeholder.com/600x400?text=Slide+1"
                            width="600"
                            height="400"
                            alt="Trip Community"
                            style={{ aspectRatio: '600 / 400', objectFit: 'cover' }}
                            className="mx-auto w-full max-w-md rounded-xl object-cover md:mx-0"
                        />
                    </div>
                </section>
                <section className="w-full bg-[#F0F8FF] py-16 md:py-24">
                    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-12 w-12 text-[#1e90ff]"
                            >
                                <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
                                <path d="M15 5.764v15"></path>
                                <path d="M9 3.236v15"></path>
                            </svg>
                            <h3 className="text-xl font-bold">Explore the World</h3>
                            <p className="text-[#808080]">
                                Discover new destinations, plan your trips, and connect with like-minded travelers.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-12 w-12 text-[#1e90ff]"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <h3 className="text-xl font-bold">Build Your Network</h3>
                            <p className="text-[#808080]">Connect with fellow travelers, share your experiences, and make new friends.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-12 w-12 text-[#1e90ff]"
                            >
                                <path d="M8 2v4"></path>
                                <path d="M16 2v4"></path>
                                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                <path d="M3 10h18"></path>
                            </svg>
                            <h3 className="text-xl font-bold">Plan Your Trips</h3>
                            <p className="text-[#808080]">Easily plan and organize your upcoming trips with our intuitive tools.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-12 w-12 text-[#1e90ff]"
                            >
                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                <circle cx="12" cy="13" r="3"></circle>
                            </svg>
                            <h3 className="text-xl font-bold">Share Your Memories</h3>
                            <p className="text-[#808080]">Capture and share your travel experiences with the community.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-12 w-12 text-[#1e90ff]"
                            >
                                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <h3 className="text-xl font-bold">Get Travel Advice</h3>
                            <p className="text-[#808080]">
                                Tap into the collective wisdom of the community and get personalized travel tips.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-12 w-12 text-[#1e90ff]"
                            >
                                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                            </svg>
                            <h3 className="text-xl font-bold">Discover Travel Deals</h3>
                            <p className="text-[#808080]">Find exclusive travel deals and discounts curated by the community.</p>
                        </div>
                    </div>
                </section>
                <section className="w-full bg-[#F0F8FF] py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl space-y-6 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter text-[#333333] sm:text-4xl">What Our Members Say</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <blockquote className="rounded-lg bg-white p-6 shadow-md">
                                    <div className="flex items-center gap-4">
                                        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">JD</span>
                                        </span>
                                        <div>
                                            <h4 className="text-lg font-semibold">John Doe</h4>
                                            <p className="text-[#808080]">Frequent Traveler</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[#808080]">
                                        "The Trip Community has been a game-changer for me. I've connected with so many
                                        like-minded travelers and discovered amazing destinations I never would have
                                        found on my own."
                                    </p>
                                </blockquote>
                                <blockquote className="rounded-lg bg-white p-6 shadow-md">
                                    <div className="flex items-center gap-4">
                                        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">JS</span>
                                        </span>
                                        <div>
                                            <h4 className="text-lg font-semibold">Jane Smith</h4>
                                            <p className="text-[#808080]">Adventure Seeker</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[#808080]">"I've been a member of the Trip Community for years and it continues to inspire me."</p>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default TestContents;
