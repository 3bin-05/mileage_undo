1. Project Vision
What is Mileage Undo?

Mileage Undo is a community-powered mileage intelligence platform designed specifically around Indian car owners and Kerala's obsession with fuel efficiency.

The application transforms the most common question every vehicle owner hears —

"Mileage ethra mone?"

— into a fun, shareable, and data-driven experience.

Instead of simply calculating fuel efficiency, Mileage Undo analyzes the user's mileage, compares it against manufacturer claims and community-driven averages, and responds with humorous Malayalam, Manglish, or English roasts.

The long-term vision is to build the largest crowdsourced real-world mileage database for Indian vehicles while presenting the information through a highly entertaining user experience.

2. Core Product Philosophy

Most fuel tracking apps fail because they focus entirely on utility.

Mileage Undo follows a different approach.

The utility is hidden beneath entertainment.

Users arrive because they want to see the roast.

Users stay because they discover trends about their car.

Users contribute data without realizing they are helping build a mileage intelligence platform.

The application should always feel like:

"A Malayalam meme page pretending to be a mileage calculator."

rather than

"A serious mileage calculator with some jokes."

3. Target Audience
Primary Users

Young car owners (18–35)

College students

First-time vehicle owners

Automobile enthusiasts

Malayalam meme culture participants

Instagram story users

WhatsApp group users

Secondary Users

Uncles and fathers obsessed with mileage

Taxi drivers

Daily commuters

Delivery drivers

Used car buyers

People researching actual mileage figures

4. User Journey
First Visit

User opens the website.

A large headline appears:

"Mileage Undo"

"Finally find out if your car drinks petrol like water."

The user enters:

Vehicle

Distance Travelled

Fuel Filled

The system calculates mileage.

The receipt rolls out dramatically.

The roast appears.

User laughs.

User screenshots.

User shares.

Returning User

User enters new fuel data.

App tracks history.

App compares with previous entries.

App detects trends.

App generates personalized roasts.

App awards ranks.

User becomes invested.

5. Technical Stack
Frontend

React (Vite)

Chosen because:

Fast startup time

Excellent DX

Minimal complexity

Perfect for a highly interactive single-page application

Styling

Tailwind CSS

Reason:

Rapid development

Easy responsive design

Custom receipt layouts

Dark mode support

Component Library

Shadcn/UI

Reason:

Beautiful defaults

Accessible components

Easy customization

Works naturally with Tailwind

Animations

Framer Motion

Used for:

Receipt rollout

Fuel gauge animations

Score reveals

Mileage badge transitions

Confetti effects

Needle movements

State Management

Zustand

Reason:

Simple

Lightweight

No Redux complexity

Perfect for vibe coding

Backend

Firebase

Services:

Authentication

Firestore

Analytics

Hosting (optional)

Database

Firestore

Reason:

No sleeping instances

Scales automatically

Simple document model

Ideal for V1

AI Layer (Future)

Google Gemini

Used for:

Dynamic roasts

Vehicle advice

Driving habit analysis

Mileage predictions

6. System Architecture

User Input

↓

Mileage Engine

↓

Vehicle Baseline Engine

↓

Score Engine

↓

Roast Engine

↓

Receipt Generator

↓

Firestore Logging

↓

Community Analytics

7. Mileage Calculation Logic

Basic Formula:

Mileage=
Fuel Consumed
Distance Traveled
	​


Example:

Distance = 350 km

Fuel = 25 L

Result = 14 kmpl

The result is then compared against:

Manufacturer Mileage

Kerala Community Average

National Community Average

Personal Historical Average

8. Community Intelligence System

This becomes the real moat.

Every submission contributes anonymously to:

Vehicle averages

Fuel type averages

District averages

State averages

Traffic condition averages

Over time Mileage Undo becomes capable of showing:

"Real-world Swift mileage in Kochi."

instead of

"Manufacturer claims 22 kmpl."

9. Roast Engine Design
Roast Categories

Excellent

Good

Average

Poor

Catastrophic

Roast Personalities

Standard Mode

Ammavan Mode

Driving Instructor Mode

Petrol Pump Owner Mode

KSRTC Driver Mode

Mechanic Mode

Thrissur Ammavan Mode

Languages

English

Malayalam

Manglish

Mixed Mode

10. Gamification System

Mileage King 👑

Responsible Ammavan 🧔

Petrol Saver ⛽

Gulf Return Driver 🏎️

Reliance Petrol Shareholder 💀

11. Future Features

Receipt OCR

Dashboard OCR

Fuel Price Tracking

Mileage Battles

Friend Challenges

District Leaderboards

AI Driving Coach

Mileage Wrapped 2027