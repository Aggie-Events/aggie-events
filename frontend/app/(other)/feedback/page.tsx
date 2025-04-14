"use client";

import { useState } from "react";
import { IoSend } from "react-icons/io5";
import ToastManager from "@/components/toast/ToastManager";
import { useFeedbackSubmit } from "@/api/feedback";
import AuthRedirect from "@/components/auth/AuthRedirect";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    feedbackType: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitFeedback = useFeedbackSubmit();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.message.trim()) {
      ToastManager.addToast(
        "Please enter your feedback message",
        "error",
        3000,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFeedback.mutateAsync({
        feedbackType: formData.feedbackType,
        message: formData.message,
      });

      // Success handling
      ToastManager.addToast("Thank you for your feedback!", "success", 3000);
      setFormData({
        feedbackType: "general",
        message: "",
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      ToastManager.addToast("Failed to submit feedback", "error", 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <AuthRedirect url="/feedback" />
      <h1 className="text-2xl font-bold mb-6">Feedback</h1>
      <p className="mb-6 text-gray-700">
        We value your feedback! Please use this form to submit any comments,
        suggestions, or issues you've encountered while using Aggie Events.
        you've encountered while using Aggie Events.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="feedbackType"
            className="block text-sm font-medium mb-1"
          >
            Feedback Type
          </label>
          <select
            id="feedbackType"
            name="feedbackType"
            value={formData.feedbackType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon"
          >
            <option value="general">General Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="improvement">Suggestion for Improvement</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Your Feedback *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon h-32 resize-y"
            placeholder="Please describe your feedback in detail..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 rounded-lg text-white font-medium transition-all
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-maroon hover:bg-maroon/90"
            }`}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <IoSend />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
}
