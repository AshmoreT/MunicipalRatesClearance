import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const applicationFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  idNumber: z.string().min(5, "Valid ID number is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  email: z
    .string()
    .email("Valid email is required")
    .optional()
    .or(z.literal("")),
  propertyAddress: z.string().min(10, "Complete property address is required"),
  standNumber: z.string().min(1, "Stand number is required"),
  propertyType: z.enum(["residential", "commercial", "industrial"]),
  reason: z.string().min(10, "Please provide a reason for clearance"),
  uploadedDocuments: z.array(z.string()).optional(),
});

type ApplicationFormData = z.infer<typeof applicationFormSchema>;

interface ApplicationFormProps {
  onSubmit?: (data: ApplicationFormData) => void;
  uploading?: any;
  documents?: any;
  handleFileChange: any;
  uploadedDocuments?: String[];
}

export default function ApplicationForm({
  onSubmit,
  uploading,
  documents,
  handleFileChange,
  uploadedDocuments,
}: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      phoneNumber: "",
      email: "",
      propertyAddress: "",
      standNumber: "",
      propertyType: "residential",
      reason: "",
    },
  });

  const handleSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSubmit?.(data);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-heading">
          Apply for Rate Clearance Certificate
        </CardTitle>
        <CardDescription>
          Complete the form below to apply for your Rate Clearance Certificate.
          All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-heading">
                Personal Information
              </h3>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        data-testid="input-full-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="63-123456X78"
                          {...field}
                          data-testid="input-id-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+263 77 123 4567"
                          {...field}
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@example.com"
                        type="email"
                        {...field}
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-heading">
                Property Information
              </h3>

              <FormField
                control={form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Robert Mugabe Avenue, Masvingo"
                        {...field}
                        data-testid="input-property-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="standNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stand Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12345"
                          {...field}
                          data-testid="input-stand-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-property-type">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="residential">
                            Residential
                          </SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-medium mb-2" htmlFor="documents">
                Attach Supporting Documents (optional) Or Proof of Payments
              </label>
              <input
                id="documents"
                name="documents"
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full"
                disabled={uploading}
              />
              {documents?.length > 0 && (
                <ul className="mt-2 text-sm text-muted-foreground">
                  {documents?.map((file, idx) => (
                    <li key={idx}>{file?.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Clearance</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Property sale, mortgage application, etc."
                      className="resize-none"
                      rows={3}
                      {...field}
                      data-testid="textarea-reason"
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly explain why you need this clearance certificate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={uploading || isSubmitting}
              data-testid="button-submit-application"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
