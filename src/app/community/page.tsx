"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition, useRef } from "react";
// Assuming this is your Server Action to handle the backend logic
// import { summarizeContribution } from "@/ai/flows/summarize-community-contributions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles, Info, BookOpen, Upload } from "lucide-react"; // Added Upload icon
import { useToast } from "@/hooks/use-toast";

// Zod schema for form validation
const formSchema = z.object({
  artifactName: z.string().min(2, {
    message: "Artifact name must be at least 2 characters.",
  }),
  // Removed artifactUrl, added artifactFile
  artifactFile: z.instanceof(File).optional().nullable(), // Optional file upload
  contributionText: z.string().min(20, {
    message: "Description must be at least 20 characters long.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CommunityPage() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null); // State for displaying file name
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artifactName: "",
      artifactFile: null, // Default to null for the file
      contributionText: "",
    },
  });

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    form.setValue("artifactFile", file); // Set the file in the form state
    setSelectedFileName(file ? file.name : null); // Update display name
  };

  // This function would normally call your backend server action
  // For now, it's a placeholder that simulates a summary
  function onSubmit(values: FormValues) {
    startTransition(async () => {
      setSummary(null);
      try {
        // In a real scenario, you would upload the file to storage (e.g., S3, Cloudinary)
        // and then pass the URL to your backend Server Action, along with other values.
        // For this frontend-only change, we simulate the process.

        const fileInfo = values.artifactFile ? ` (with file: ${values.artifactFile.name})` : "";

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing time
        setSummary(`Thank you for your submission about "${values.artifactName}"${fileInfo}. The data has been received and will be authenticated and added to the archive.`);
        toast({
          title: "Contribution Received!",
          description: "Your submission has been sent for review.",
        });
        form.reset(); // Reset form after successful submission
        setSelectedFileName(null); // Clear selected file name display
        if (fileInputRef.current) { // Clear the actual file input
            fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Submission failed:", error);
        toast({
          title: "Error",
          description: "Failed to submit contribution. Please try again.",
          variant: "destructive",
        })
      }
    });
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl font-bold mb-3">Community Contributions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share your knowledge about cultural artifacts and help build our digital archive.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Share Your Knowledge</CardTitle>
                <CardDescription>
                  Your contributions are reviewed for authenticity before being added to the archive.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="artifactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Artifact/Mural/Manuscript Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Phurba Dagger" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* File Upload Section */}
                <FormField
                  control={form.control}
                  name="artifactFile" // This field is now for the File object
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Upload Image/Video (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            className="hidden" // Hide the default file input
                            ref={fileInputRef} // Attach ref
                            onChange={handleFileChange}
                            accept="image/*,video/*" // Accept image and video files
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()} // Trigger click on hidden input
                            className="flex items-center gap-2 h-12 w-full justify-center"
                          >
                            <Upload className="h-5 w-5" />
                            {selectedFileName ? selectedFileName : "Choose File"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a relevant image or video (max 5MB).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contributionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Your Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share details, history, or stories about the artifact..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  Submit Contribution
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 sticky top-24">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">AI-Generated Summary</CardTitle>
                <CardDescription>
                  The AI will analyze your input and create a concise summary.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 min-h-[300px] flex items-center justify-center">
            {isPending ? (
              <div className="flex flex-col items-center gap-3 text-muted-foreground py-8">
                <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                <p className="text-lg font-medium">Analyzing your input...</p>
                <p className="text-sm text-center max-w-xs">This may take a few moments</p>
              </div>
            ) : summary ? (
              <div className="py-4 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold">Summary</h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="leading-relaxed text-foreground">{summary}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <div className="bg-muted rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-2">Awaiting Input</h3>
                <p className="text-muted-foreground">Submit a contribution to see the summary.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-amber-50 rounded-b-lg">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>This summary is generated by AI. Please review it for accuracy before submitting.</p>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6 border">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Info className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">How It Works</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Enter the name of a cultural artifact or monastery</li>
              <li>Our AI will generate a concise summary based on known information</li>
              <li>High-quality submissions may be added to the permanent archive</li>
              <li>Rate your source quality to help us evaluate the information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}