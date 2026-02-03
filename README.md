🚀 LeanCon AI Review Summarizer
An intelligent, AI-driven sentiment analysis engine that transforms unstructured customer feedback into actionable business insights.

📖 Overview
LeanCon AI is a professional-grade tool designed to solve the "Information Overload" problem for Product Managers and Customer Success teams. Instead of reading hundreds of reviews, the system uses Llama 3.3 (via Groq) to perform Aspect-Based Sentiment Analysis, breaking down feedback into specific categories, scores, and evidence-based reasoning.

✨ Key Features
AI-Powered Aspect Analysis: Automatically identifies key product attributes (e.g., Sound Quality, Build, Price) and scores them from 1-10.

Evidence-Based Reasoning: Every score is backed by "AI Logic" that explains the frequency and intensity of mentions in the source text.

Interactive Radar Chart: A dynamic SVG visualization built with Recharts, allowing users to see the product's "fingerprint" at a glance.

Deep-Dive Interactivity: Clicking on any chart segment reveals the specific reasoning and a representative quote from the actual review.

Low Latency Performance: Powered by Groq's LPUs, providing near-instant analysis of complex text.

🛠 Tech Stack
Framework: Next.js 15 (App Router)

Language: TypeScript

AI Model: Llama 3.3 70B via Groq

Visualization: Recharts

Styling: Tailwind CSS

🧠 Smart Prompting (The "Secret Sauce")
The engine implements strict Grounding Rules to eliminate AI hallucinations:

Verified Counting: The AI is forced to count the exact number of provided reviews and use that as the denominator in its logic.

Zero-Shot Scoring: Uses advanced linguistic understanding to normalize sentiment into numerical data without pre-labeled training sets.

🚀 Getting Started
Clone the repository: git clone https://github.com/your-username/leancon-ai.git

Install dependencies: npm install

Set up your .env.local: GROQ_API_KEY=your_key_here

Run the development server: npm run dev
