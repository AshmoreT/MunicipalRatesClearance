import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { FileText, Search, Clock, Shield, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
              Rate Clearance Certificate System
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Apply for and track your Rate Clearance Certificate online. 
              Fast, transparent, and secure municipal services for Masvingo residents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/apply">
                <a data-testid="link-cta-apply">
                  <Button size="lg" className="w-full sm:w-auto">
                    <FileText className="mr-2 h-5 w-5" />
                    Apply Now
                  </Button>
                </a>
              </Link>
              <Link href="/track">
                <a data-testid="link-cta-track">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Search className="mr-2 h-5 w-5" />
                    Track Application
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="rounded-full bg-primary/10 p-3 w-fit">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-heading">1. Submit Application</CardTitle>
                  <CardDescription>
                    Fill out the online form with your property details and personal information
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="rounded-full bg-status-review/10 p-3 w-fit">
                    <Clock className="h-6 w-6 text-status-review" />
                  </div>
                  <CardTitle className="font-heading">2. Review Process</CardTitle>
                  <CardDescription>
                    Our team verifies your payment records and processes your application within 24-48 hours
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="rounded-full bg-status-approved/10 p-3 w-fit">
                    <CheckCircle className="h-6 w-6 text-status-approved" />
                  </div>
                  <CardTitle className="font-heading">3. Get Certificate</CardTitle>
                  <CardDescription>
                    Download your official Rate Clearance Certificate immediately upon approval
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-center mb-12">
              Why Choose Our System?
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <Clock className="h-10 w-10 text-primary" />
                  <h3 className="font-semibold font-heading">Fast Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduced processing time from 14 days to under 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-2">
                  <Search className="h-10 w-10 text-primary" />
                  <h3 className="font-semibold font-heading">Real-time Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your application status anytime, anywhere
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-2">
                  <Shield className="h-10 w-10 text-primary" />
                  <h3 className="font-semibold font-heading">Secure & Transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    Fraud-proof records with complete transparency
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-2">
                  <FileText className="h-10 w-10 text-primary" />
                  <h3 className="font-semibold font-heading">Digital Certificates</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant download of official certificates
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <h2 className="text-3xl font-bold font-heading">
                  Ready to Get Started?
                </h2>
                <p className="text-lg opacity-90">
                  Apply for your Rate Clearance Certificate today and experience 
                  faster, more efficient municipal services.
                </p>
                <Link href="/apply">
                  <a data-testid="link-footer-cta">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      Start Application
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Masvingo City Council. All rights reserved.</p>
          <p className="mt-2">For support, contact: info@masvingo.gov.zw | +263 39 262 713</p>
        </div>
      </footer>
    </div>
  );
}
