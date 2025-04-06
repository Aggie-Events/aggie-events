import { fetchUtil } from "@/api/fetch";
import { useMutation, useQuery } from "@tanstack/react-query";

// Interface for feedback submission data
export interface FeedbackData {
  name?: string;
  email?: string;
  feedbackType: string;
  message: string;
}

// Interface for feedback response
export interface Feedback {
  feedback_id: number;
  name: string | null;
  email: string | null;
  feedback_type: string;
  message: string;
  date_created: Date;
}

/**
 * React Query hook to submit feedback
 * @returns {UseMutationResult} The mutation result
 */
export function useFeedbackSubmit() {
  return useMutation({
    mutationFn: async (feedback: FeedbackData) => {
        const response = await fetchUtil(
            `${process.env.NEXT_PUBLIC_API_URL}/feedback`,
            {
              method: "POST",
              body: feedback,
            },
          );
        return response.json() ?? {};
    },
  });
}

// /**
//  * React Query hook to fetch all feedback submissions (for moderators only)
//  * @returns {UseQueryResult<Feedback[], Error>} The feedback submissions
//  */
// export function useAllFeedback() {
//   return useQuery<Feedback[], Error>({
//     queryKey: ["feedback", "all"],
//     queryFn: async () => {
//       const response = await fetchUtil(
//         `${process.env.NEXT_PUBLIC_API_URL}/feedback`,
//         {
//           method: "GET",
//         },
//       );
      
//       const feedback = await response.json();
//       return feedback.map((f: any) => ({
//         ...f,
//         date_created: new Date(f.date_created),
//       }));
//     },
//     retry: false,
//   });
// }

// /**
//  * React Query hook to fetch a single feedback submission by ID (for moderators only)
//  * @param {string} feedbackId - The ID of the feedback to fetch
//  * @returns {UseQueryResult<Feedback, Error>} The feedback submission
//  */
// export function useFeedback(feedbackId: string) {
//   return useQuery<Feedback, Error>({
//     queryKey: ["feedback", feedbackId],
//     queryFn: async () => {
//       const response = await fetchUtil(
//         `${process.env.NEXT_PUBLIC_API_URL}/feedback/${feedbackId}`,
//         {
//           method: "GET",
//         },
//       );
      
//       const feedback = await response.json();
//       return {
//         ...feedback,
//         date_created: new Date(feedback.date_created),
//       };
//     },
//     retry: false,
//   });
// }
