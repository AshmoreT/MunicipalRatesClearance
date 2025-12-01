import CertificatePreview from '../CertificatePreview'

export default function CertificatePreviewExample() {
  return (
    <div className="max-w-2xl">
      <CertificatePreview 
        referenceNumber="RCC-2025-001234"
        applicantName="Tendai Moyo"
        propertyAddress="123 Robert Mugabe Avenue, Masvingo"
        approvalDate="2025-01-20"
        onDownload={() => console.log("Download certificate")}
      />
    </div>
  )
}
