'use client';
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, MessageSquare, BarChart3 } from 'lucide-react'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components"; export default async function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-full"></div>
          <span className="text-2xl font-bold text-black">TeamSync</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-800 hover:text-black transition-colors">Features</a>
          <a href="#integrations" className="text-gray-800 hover:text-black transition-colors">Integrations</a>
          <a href="#pricing" className="text-gray-800 hover:text-black transition-colors">Pricing</a>
        </nav>
        <Button variant="outline" className="hidden md:inline-flex">
          <LoginLink>Login</LoginLink>
        </Button>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-black mb-6">
            Unify Your Team's Work
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Seamlessly integrate Jira and Slack, empowering managers with AI-driven insights into their team's progress.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <RegisterLink>
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </RegisterLink>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle, title: "Task Aggregation", description: "Automatically fetch and organize tasks from Jira" },
              { icon: MessageSquare, title: "AI-Powered Insights", description: "Interact with your team's data using natural language" },
              { icon: BarChart3, title: "Progress Tracking", description: "Visualize team performance and project status" }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                <feature.icon className="h-12 w-12 text-black mb-4" />
                <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="integrations" className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-black mb-12">Seamless Integrations</h2>
          <div className="flex justify-center items-center space-x-12">
            <img src="/placeholder.svg?height=80&width=200" alt="Jira logo" className="h-20 object-contain" />
            <img src="/placeholder.svg?height=80&width=200" alt="Slack logo" className="h-20 object-contain" />
          </div>
        </section>

        <section className="bg-black text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Team's Productivity?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of managers who are leveraging AI to streamline their workflow and boost team performance.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-black rounded-full"></div>
            <span className="text-xl font-bold text-black">TeamSync</span>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-6">
            <a href="#" className="text-gray-700 hover:text-black transition-colors">About</a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">Blog</a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">Careers</a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">Privacy</a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
