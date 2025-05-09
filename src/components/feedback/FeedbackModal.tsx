"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import useFeedbackModal from "@/hooks/useFeedbackModal";

const feedbackSchema = z.object({
  message: z.string().min(1, { message: "Feedback is required" }),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export default function FeedbackModal() {
  const { open, setOpen } = useFeedbackModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(data: FeedbackForm) {
    try {
      setLoading(true);
      // In a real app, you would send the feedback to your API
      console.log("Feedback submitted:", data);

      toast({
        description: "Thank you for your feedback!",
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
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
                Submit Feedback
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
