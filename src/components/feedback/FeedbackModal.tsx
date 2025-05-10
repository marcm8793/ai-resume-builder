"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import useFeedbackModal from "@/hooks/useFeedbackModal";
import { useUser } from "@clerk/nextjs";
import { feedbackSchema, FeedbackForm } from "@/lib/validation";
import { env } from "@/env";
// EmailJS configuration
const EMAILJS_SERVICE_ID = env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export default function FeedbackModal() {
  const { open, setOpen } = useFeedbackModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      message: "",
      email: user?.emailAddresses[0].emailAddress,
    },
  });

  async function onSubmit(data: FeedbackForm) {
    try {
      setLoading(true);

      // Prepare template parameters for EmailJS
      const templateParams = {
        message: data.message,
        from_email: user?.emailAddresses[0].emailAddress || "Not provided",
        from_name: user?.fullName || "Boring Resume User",
        to_name: "Boring Resume Team",
      };

      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );

      toast({
        description: "Thank you for your feedback!",
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            We&apos;d love to hear your thoughts about Boring Resume Builder.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Your email</Label>
                  <FormControl>
                    <input
                      type="email"
                      id="email"
                      placeholder="your.email@example.com"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="message">Your feedback</Label>
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Tell us what you think..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
