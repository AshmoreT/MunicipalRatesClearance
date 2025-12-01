import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificatePreviewProps {
  referenceNumber: string;
  applicantName: string;
  propertyAddress: string;
  approvalDate: string;
  onDownload?: () => void;
}

export default function CertificatePreview({
  referenceNumber,
  applicantName,
  propertyAddress,
  approvalDate,
  onDownload,
}: CertificatePreviewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    try {
      // Call the existing onDownload callback if provided
      if (onDownload) {
        onDownload();
      }

      // Create a simplified version of the certificate for PDF generation
      const pdfContainer = document.createElement("div");
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.top = "0";
      pdfContainer.style.width = "800px";
      pdfContainer.style.backgroundColor = "white";
      pdfContainer.style.padding = "40px";
      pdfContainer.style.fontFamily = "Arial, sans-serif";
      
      // Create certificate content with simple styling
      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: #f0f9ff; border-radius: 50%; padding: 20px; margin-bottom: 20px;">
            <div style="color: #007bff; font-size: 24px;">🏆</div>
          </div>
          <h1 style="font-size: 28px; font-weight: bold; color: #007bff; margin: 10px 0 5px 0;">
            Rate Clearance Certificate
          </h1>
          <p style="color: #666; font-size: 14px; margin: 0;">Masvingo City Council</p>
        </div>

        <div style="border-top: 2px solid #e0e0e0; border-bottom: 2px solid #e0e0e0; padding: 20px 0; margin: 20px 0;">
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 10px; margin-bottom: 10px;">
            <span style="font-weight: bold;">Certificate No:</span>
            <span>${referenceNumber}</span>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 10px; margin-bottom: 10px;">
            <span style="font-weight: bold;">Issued To:</span>
            <span>${applicantName}</span>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 10px; margin-bottom: 10px;">
            <span style="font-weight: bold;">Property:</span>
            <span>${propertyAddress}</span>
          </div>
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 10px;">
            <span style="font-weight: bold;">Issue Date:</span>
            <span>${approvalDate}</span>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-style: italic; margin-bottom: 30px;">
            This certifies that all municipal rates and taxes for the above property
            have been paid in full as of the issue date.
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px; color: #999; font-size: 12px;">
          <p>Issued by Masvingo City Council</p>
          <p>Official Document - Do Not Alter</p>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      // Capture the certificate as an image
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      // Clean up
      document.body.removeChild(pdfContainer);

      // Create PDF
      const pdf = new jsPDF("portrait", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      
      // Calculate dimensions to fit A4 page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 20;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Download the PDF
      pdf.save(`rate-clearance-certificate-${referenceNumber}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  return (
    <div ref={certificateRef}>
      <Card className="bg-gradient-to-br from-card to-accent/5" data-testid="card-certificate">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Award className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold font-heading text-primary">
            Rate Clearance Certificate
          </h3>
          <p className="text-sm text-muted-foreground">Masvingo City Council</p>
        </div>

        <div className="border-t border-b py-4 space-y-3">
          <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
            <span className="font-semibold">Certificate No:</span>
            <span data-testid="text-certificate-number">{referenceNumber}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
            <span className="font-semibold">Issued To:</span>
            <span data-testid="text-certificate-name">{applicantName}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
            <span className="font-semibold">Property:</span>
            <span data-testid="text-certificate-property">{propertyAddress}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
            <span className="font-semibold">Issue Date:</span>
            <span data-testid="text-certificate-date">{approvalDate}</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground italic">
            This certifies that all municipal rates and taxes for the above property 
            have been paid in full as of the issue date.
          </p>
          
          <Button
            className="w-full sm:w-auto"
            onClick={handleDownloadPDF}
            data-testid="button-download-certificate"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Certificate (PDF)
          </Button>
        </div>
      </CardContent>
      </Card>
    </div>
  );
}
