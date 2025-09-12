📄 Product Requirements Document (PRD)
Class Parent Council Website
1. Purpose
To provide a simple, attractive, and cost-effective website for parents of the class to easily access updates, important links, and participate in polls/voting without needing accounts.
2. Goals
Central information hub for the parent community.
Enable easy access to resources and announcements.
Provide lightweight, duplicate-preventing voting functionality.
Deliver a visually appealing design that works well on desktop and mobile.
Keep hosting and maintenance low cost and simple.
3. Users
Primary: Parents of students in the class (approx. 30–50 users).
Admin: You, managing updates, polls, and announcements.
4. Key Features
Feature	Details	Priority
Homepage	Modern, clean homepage with the latest announcements.	High
Important Links Section	Clearly displayed links to forms, calendars, school portals.	High
Announcements/News Section	Easily updated posts or bulletins with timestamps.	High
Voting/Polls	Embed or integrate a voting system that prevents duplicate votes via unique links or cookies.	High
Contact Form	Simple form to submit questions/feedback (via email or Google Form).	Medium
Responsive Design	Works seamlessly on mobile and tablets.	High
5. Technical Overview
Component	Choice	Rationale
Framework	Next.js (React)	Easy to develop in Cursor, SEO-friendly, static export for low hosting cost.
Styling	Tailwind CSS	Fast, modern, mobile-first styling.
Hosting	Vercel (Free Tier)	Free for small projects, seamless with Next.js.
Domain	Google Domains or Namecheap (~$12/year)	Clean, professional URL.
Voting	Typeform or Google Forms + Unique Links OR integrate a small custom voting system with Firebase.	Simple, no-login voting with basic duplicate protection.
CMS	None (Static Site)	Content updated via Cursor directly (simple for a single admin).
Forms	Formspree or Netlify Forms	Easy email delivery for contact submissions.
6. Voting Implementation Options
Option	Description	Pros	Cons
Google Forms + One-Time Links	Generate unique links sent to each parent.	Easiest setup, no dev overhead.	Manual link distribution.
Typeform (Free)	Embed polls directly in the site.	Polished UI, some duplicate prevention.	Limited free responses/month.
Custom Firebase Vote System	Create a lightweight voting backend. Parents click emailed unique links.	Fully integrated, controlled.	Requires some coding effort.
Recommendation: Start with Google Forms or Typeform for simplicity, then build a custom solution later if needed.
7. Deployment Plan
Setup Repository: Initialize Next.js app with Tailwind CSS in Cursor.
Design Layout: Create components for navbar, footer, homepage, links section, announcements section.
Add Voting Integration: Embed Google Form or Typeform in a dedicated “Vote” page.
Host: Deploy to Vercel, connect custom domain.
Test: Mobile/desktop testing, ensure forms and votes work.
Launch: Share the URL with parents.
Maintenance: Push updates via Cursor; simple Git workflow.
8. Success Metrics
Parents can access information in <2 clicks.
Voting participation >80% of parents per poll.
Site uptime >99% (Vercel covers this for free).
Content updates take <5 minutes per change.
9. Non-Goals
No complex logins or user management.
No heavy CMS or database (lightweight site is sufficient).
No large media hosting (videos, large files can be Google Drive links).
This PRD balances your coding ability with Cursor and your need for a polished but low-cost solution.
